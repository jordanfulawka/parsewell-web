import type { EditSuggestion } from '../lib/types';
import EditTypeBadge from './EditTypeBadge';

function EditSuggestionItem({
  editSuggestion,
}: {
  editSuggestion: EditSuggestion;
}) {
  return (
    <div className='bg-[#FDFBF8] border border-subtle-border rounded-xl p-6'>
      <EditTypeBadge editType={editSuggestion.editType} />
      <div className='flex flex-col gap-3 mt-4'>
        <p className='text-sm text-secondary-text'>
          {editSuggestion.beforeText}
        </p>
        <p className='text-primary-text font-bold'>
          {editSuggestion.afterText}
        </p>
        <div />
      </div>
      <div className='bg-tertiary-text/30 h-px mb-3' />
      <div className='text-sm text-secondary-text'>
        Why: {editSuggestion.reason}
      </div>
    </div>
  );
}

export default EditSuggestionItem;
