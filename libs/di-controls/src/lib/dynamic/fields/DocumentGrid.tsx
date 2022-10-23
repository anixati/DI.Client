import { getErrorMsg, IApiResponse, IDataResponse, IEntity, IEntityResponse, IListResponse } from '@dotars/di-core';
import { Alert, Badge, Button, Card, Center, createStyles, Grid, Group, LoadingOverlay, ScrollArea, Table, Text, TextInput, UnstyledButton } from '@mantine/core';
import { useForm } from '@mantine/form';
import { RichTextEditor, Editor } from '@mantine/rte';
import axios from 'axios';
import * as jpatch from 'fast-json-patch';
import { useMemo, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { ConfirmBtn, SearchCmdBar, ShowError, ShowInfo } from '../../controls';
import { ISchemaFieldProps } from './SchemaFieldFactory';
import { AlertCircle } from 'tabler-icons-react';
const useStyles = createStyles((theme) => ({
  docMain: {
    backgroundColor: `${theme.colors['gray'][1]}`,
  },
  docHeader: {
    backgroundColor: theme.white,
    paddingRight: 10,
    paddingBottom: 4,
    borderBottom: '1px solid #ccc',
  },
  docContent: {},

  listView: {
    padding: 5,
    //borderRight: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    height: '83vh',
  },
  entityView: {
    backgroundColor: theme.white,
    height: '83vh',
  },
  card: {
    backgroundColor: theme.white,
  },
  cardHeader: {
    padding: 6,
    borderBottom: `1px solid ${theme.colors['gray'][3]}`,
  },
  rowSelected: {
    backgroundColor: theme.colors[theme.primaryColor][1],
  },
  linkbox: { width: '100%', padding: 1, margin: 0 },
  cardContent: {},
  form: {
    padding: 8,
    borderBottom: `1px solid ${theme.colors['gray'][3]}`,
  },
}));

interface IDocListResponse {
  reason: number;
  failed: boolean;
  messages: Array<string> | null;
  result?: IList;
}
interface IList extends IListResponse {
  items: Array<IDocRecord>;
}
interface IDocRecord {
  Id: number;
  Locked?: boolean;
  Disabled?: boolean;
  Title: string;
  ModifiedOn: string;
  ModifiedBy: string;
}

interface IDocument extends IEntity {
  title: string;
  notes: string;
  entityName: string;
  entityId: number;
  //   createdByStamp: string;
  //   modifiedByStamp: string;
}

export const DocumentGrid = (rx: ISchemaFieldProps) => {
  const { classes, cx } = useStyles();
  const { field } = rx;
  const { entityId } = useParams();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selection, setSelection] = useState<IDocRecord | undefined>(undefined);
  const [original, setOriginal] = useState<IDocument | undefined>(undefined);
  const isNew = original === undefined;
  const [, setScrolled] = useState(false);
  const [notes, onNoteChange] = useState('');
  const editorRef = useRef() as React.MutableRefObject<Editor>; //useRef<Editor>();

  const editor = editorRef?.current?.getEditor();
  //const upgEditor = editorRef?.current.makeUnprivilegedEditor(editor);

  const getDocList = async () => {
    try {
      const payLoad = {
        Index: 0,
        Size: 1000,
        filter: {
          rules: [
            {
              field: 'act.entityname',
              operator: 'equals to',
              value: `${field.viewId}`,
            },
            {
              field: 'act.entityid',
              operator: 'equals to',
              value: `${entityId}`,
            },
          ],
        },
      };
      const resp = await axios.post<IDocListResponse>(`/qry/schema/documents`, payLoad);
      if (resp.data?.result?.items) {
        const rs = resp.data?.result.items;
        return rs;
      } else throw new Error(`Failed to retrive `);
    } catch (ex) {
      ShowError('Table schema error', `Details:${getErrorMsg(ex)}`);
    }
    return undefined;
  };
  const { isLoading, error, data, refetch, isSuccess } = useQuery(field.viewId, async () => await getDocList(), { keepPreviousData: false, staleTime: 0 });
  const memData = useMemo(() => data, [data]);
  const rows =
    memData === undefined || memData.length <= 0 ? (
      <tr>
        <td>
          <Center>No data found!</Center>
        </td>
      </tr>
    ) : (
      memData
        ?.filter((x) => x.Title?.toLowerCase().includes(search) || search === '')
        .map((row) => {
          const selected = selection && selection.Id === row.Id;
          // if (selected) entityCtx?.select(row);
          return (
            <tr key={row.Id} className={cx({ [classes.rowSelected]: selected })}>
              <td>
                <UnstyledButton onClick={() => selectRow(row)} className={classes.linkbox}>
                  <div>
                    <Group>
                      <Text size="sm" mb={3} sx={{ lineHeight: 1 }}>
                        {row.Title}
                      </Text>
                      {row.Disabled && (
                        <Badge color="red" size="xs">
                          Inactive
                        </Badge>
                      )}
                      {row.Locked && (
                        <Badge color="cyan" size="xs">
                          Locked
                        </Badge>
                      )}
                    </Group>
                    <Text size="xs" color="dimmed">
                      {row.ModifiedOn} by {row.ModifiedBy}
                    </Text>
                  </div>
                </UnstyledButton>
              </td>
            </tr>
          );
        })
    );

  const getDocument = async (id: number) => {
    try {
      setLoading(true);
      const resp = await axios.get<IDataResponse<IEntityResponse<IDocument>>>(`documents/${id}`);
      if (resp.data.failed) {
        ShowError('Failed', `${resp.data.messages}`);
        return undefined;
      }
      if (resp.data.result?.item) return resp.data.result.item;
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
    return undefined;
  };

  // const frmConfig =;
  const form = useForm<IDocument>({
    initialValues: {
      id: 0,
      title: '',
      notes: '',
      entityName: '',
      entityId: 0,
    },
    validate: {
      title: (value: string) => (value.length < 5 ? 'Title must have at least 5 letters' : null),
    },
  });
  const selectRow = async (row?: IDocRecord) => {
    setSelection(row);
    if (row !== undefined) {
      const doc = await getDocument(row.Id);
      setOriginal(doc);
      if (doc) {
        form.setValues(doc);
        setEditorVal(doc.notes);
      } else {
        form.reset();
        setEditorVal('');
      }
    } else {
      setOriginal(undefined);
      form.reset();
      setEditorVal('');
    }
  };

  const setEditorVal = (inpStr: string) => {
    if (editor) {
      const delta = editor.clipboard.convert(decodeURIComponent(inpStr));
      editor.setContents(delta, 'silent');
    }
  };
  const refSub = useRef<HTMLButtonElement>(null);
  const onCreate = () => {
    form.clearErrors();
    form.validate();
    if (Object.keys(form.errors).length === 0) refSub?.current?.click();
  };
  const onUpdate = () => {
    form.clearErrors();
    form.validate();
    if (Object.keys(form.errors).length === 0) refSub?.current?.click();
  };
  const handleSubmit = (values: typeof form.values) => {
    const data = values as IDocument;
    if (data) {
      try {
        setLoading(true);
        if (data.id === 0) createItemAsync(data);
        else updateItemAsync(data);
      } finally {
        setLoading(false);
      }
    }
  };
  const createItemAsync = async (item: IDocument) => {
    await createItem(item);
  };
  const createItem = async (item: IDocument) => {
    try {
      setLoading(true);
      item.entityName = `${field.viewId}`;
      item.entityId = Number(entityId);
      item.notes = encodeURIComponent(notes);
      const resp = await axios.post<IApiResponse>(`documents/create`, item);
      if (resp.data.failed) {
        ShowError('Failed', `${resp.data.messages}`);
      } else {
        ShowInfo('Success', `Created Succesfully`);
        setOriginal(undefined);
        form.reset();
        setEditorVal('');
        refetch();
      }
    } catch (e) {
      console.log(e);
      ShowError('Failed', `API error:${getErrorMsg(e)}`);
    } finally {
      setLoading(false);
    }
  };
  const updateItemAsync = async (item: IDocument) => {
    await updateItem(item);
  };
  const updateItem = async (item: IDocument) => {
    if (original) {
      try {
        setLoading(true);
        if (editor) {
          const content = encodeURIComponent(editor.root.innerHTML);
          const changeSet = [
            { op: 'replace', path: '/title', value: item.title },
            { op: 'replace', path: '/notes', value: content },
          ];
          const resp = await axios.patch<IApiResponse>(`documents/${original.id}`, changeSet);
          if (resp.data.failed) {
            ShowError('Failed', `${resp.data.messages}`);
          } else {
            ShowInfo('Success', `Updated Succesfully`);
            refetch();
          }
        }
      } catch (e) {
        console.log(e);
        ShowError('Failed', `API error:${getErrorMsg(e)}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const onClickDelete = async () => {
    try {
      if (original) {
        setLoading(true);
        const resp = await axios.post<IApiResponse>(`/documents/change`, { id: original.id, name: 'User Action', reason: 'Delete', action: 6 });
        const data = resp.data;
        if (data.failed) {
          console.log(data);
          ShowError('Failed to change state', `${data.messages}`);
        } else {
          ShowInfo('Success', `Deleted Succesfully`);
          setOriginal(undefined);
          form.reset();
          setEditorVal('');
          refetch();
        }
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={classes.docMain}>
      <Group position="apart" className={classes.docHeader}>
        <Group position="left">
          <SearchCmdBar title="" searchStr={search} OnSearch={(v) => setSearch(v)} OnRefresh={() => refetch()} OnCreate={() => selectRow(undefined)} canCreate={false} />
        </Group>
        <Group position="center">
        

          {/* <Text color="dotars" size="sm">  </Text> */}
        </Group>
        <Group position="left" spacing={1}>
          <Button color="dotars" compact onClick={() => selectRow(undefined)} disabled={selection === undefined}>
            New
          </Button>
          {isNew && (
            <Button color="dotars" compact onClick={onCreate}>
              Save
            </Button>
          )}
          {!isNew && (
            <>
              <Button color="dotars" compact onClick={onUpdate}>
                Update
              </Button>
              <ConfirmBtn color="red" style={{ marginLeft: 10 }} compact OnOk={onClickDelete} disabled={false} btnTxt="Delete" confirmTxt="Are you sure you want to delete?" />
            </>
          )}
        </Group>
      </Group>
      <Grid className={classes.docContent}>
        <Grid.Col span={3} style={{ minHeight: 280, padding: 10 }}>
          <>
         
            {isLoading && <LoadingOverlay visible={true} />}
            {error && (
              <Alert title="Error!" color="red">
                {getErrorMsg(error)}{' '}
              </Alert>
            )}
            {isSuccess && data && (
              <div className={classes.listView}> 
              <Alert  >
           <Text align="center" size="xs"> Add signed instruments here <br/>or relevant letters of appointment</Text>
          </Alert>
                <div className={classes.cardContent}>
                  <ScrollArea sx={{ height: '76vh' }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                    <Table sx={{ backgroundColor: 'white' }} verticalSpacing={1}>
                      <tbody>{rows}</tbody>
                    </Table>
                  </ScrollArea>
                </div>
              </div>
            )}
          </>
        </Grid.Col>
        <Grid.Col span={9}>
          <div>
            <form onSubmit={form.onSubmit(handleSubmit)} className={classes.form}>
              <LoadingOverlay visible={loading} />
              <button hidden={true} ref={refSub} type={'submit'} />
              <TextInput required label="Title" placeholder="Title" {...form.getInputProps('title')} />
              <RichTextEditor ref={editorRef} value={notes} onChange={onNoteChange} sx={{ marginTop: 10, height: 650 }} controls={[['clean'], ['bold', 'italic', 'underline', 'link'], ['h1', 'h2', 'h3']]} />
            </form>
          </div>
        </Grid.Col>
      </Grid>
    </div>
  );
};
