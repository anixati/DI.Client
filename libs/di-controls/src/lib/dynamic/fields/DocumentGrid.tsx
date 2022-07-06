import { getErrorMsg, IApiResponse, IDataResponse, IEntity, IEntityResponse, IListResponse } from '@dotars/di-core';
import { Alert, Badge, Button, Card, Center, createStyles, Grid, Group, LoadingOverlay, ScrollArea, Table, Text, TextInput, UnstyledButton } from '@mantine/core';
import { useForm } from '@mantine/form';
import { RichTextEditor, Editor } from '@mantine/rte';
import axios from 'axios';
import * as jpatch from 'fast-json-patch';
import { useMemo, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { SearchCmdBar, ShowError, ShowInfo } from '../../controls';
import { ISchemaFieldProps } from './SchemaFieldFactory';

const useStyles = createStyles((theme) => ({
  container: {
    padding: 0,
    width: '100%',
    height: '86vh',
  },
  listView: {
    width: 300,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    height: '83vh',
  },
  entityView: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    height: '83vh',
  },
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },
  cardHeader: {
    padding: theme.spacing.xs,
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
  },
  rowSelected: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2) : theme.colors[theme.primaryColor][0],
  },
  linkbox: { width: '100%', padding: 1, margin: 0 },
  cardContent: {},
  form: {
    padding: 8,
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]}`,
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
        form.reset();
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

  return (
    <Grid justify="space-between">
      <Grid.Col span={3} style={{ minHeight: 280, padding: 5 }}>
        <>
          {isLoading && <LoadingOverlay visible={true} />}
          {error && (
            <Alert title="Error!" color="red">
              {getErrorMsg(error)}{' '}
            </Alert>
          )}
          {isSuccess && data && (
            <Card withBorder p="lg" className={classes.listView} sx={{ margin: 10 }}>
              <Card.Section className={classes.cardHeader}>
                <SearchCmdBar title="" searchStr={search} OnSearch={(v) => setSearch(v)} OnRefresh={() => refetch()} OnCreate={() => selectRow(undefined)} canCreate={true} />
              </Card.Section>
              <Card.Section className={classes.cardContent}>
                <ScrollArea sx={{ height: '76vh' }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                  <Table sx={{}} verticalSpacing="xs" width={150}>
                    <tbody>{rows}</tbody>
                  </Table>
                </ScrollArea>
              </Card.Section>
            </Card>
          )}
        </>
      </Grid.Col>
      <Grid.Col span={9} style={{ minHeight: 280, padding: 5 }}>
        <LoadingOverlay visible={loading} />
        <Card.Section className={classes.cardHeader}>
          <Group spacing="sm" position="apart">
            <Group spacing="sm" position="left">
              <div>
                <Text size="sm" weight={500}>
                  {/* <div>
                          {ectx?.entity === undefined && `New ${rx.name}`}
                          {ectx?.entity && (ectx.entity as INamedRecord) && `${(ectx.entity as INamedRecord).name}`}
                        </div> */}
                </Text>
              </div>
            </Group>
            <Group spacing={0} position="right">
              {isNew && (
                <Button color="dotars" compact onClick={onCreate}>
                  Create
                </Button>
              )}
              {!isNew && (
                <Button color="dotars" compact onClick={onUpdate}>
                  Update
                </Button>
              )}
            </Group>
          </Group>
        </Card.Section>
        <form onSubmit={form.onSubmit(handleSubmit)} className={classes.form}>
          <button hidden={true} ref={refSub} type={'submit'} />
          <TextInput required label="Title" placeholder="Title" {...form.getInputProps('title')} />
          <RichTextEditor ref={editorRef} value={notes} onChange={onNoteChange} sx={{ marginTop: 10, height: 650 }}
           controls={[
             ['clean'],
            ['bold', 'italic', 'underline', 'link'],
            [ 'h1', 'h2', 'h3']
          ]}
          />
        </form>
      </Grid.Col>
    </Grid>
  );
};
