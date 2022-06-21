import { ActionFormBtn, PageView, SchemaForm, SchemaListRef, SchemaListTable } from "@dotars/di-controls";
import { createRef } from "react";
import { useParams } from "react-router-dom";
import { Receipt } from "tabler-icons-react";

export const SkillsPage: React.FC = () => {
    const { entityId } = useParams();
  
    return <SchemaForm title="Skill Details"  listUrl="/boards/skills"
    schema="skill" entityId={entityId} icon={<Receipt />} canEdit={true} />;
  };
  

  
export const SkillsList: React.FC = () => {
    const listRef = createRef<SchemaListRef>();
    const onClose = () => {
      listRef.current?.refresh();
    };
    return (
      <PageView title="Skills" desc="" icon={<Receipt />} renderCmds={() => <ActionFormBtn title="New Skill"
       schema="skill" onClose={onClose}  />}>
        <SchemaListTable
          ref={listRef}
          schemas={[
            { label: 'Active Skills', value: 'ActiveSkills' },
            { label: 'Inactive Skills', value: 'InactiveSkills' },
          ]}
        />
      </PageView>
    );
  };
  