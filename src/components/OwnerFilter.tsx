import React from 'react';
import { Check, Users } from 'lucide-react';
import { teamMembers } from '../utils/mockData';
import { useAIAssistant } from '../context/AIAssistantContext';
export function OwnerFilter() {
  const {
    selectedOwners,
    toggleOwner,
    selectAllOwners,
    unselectAllOwners
  } = useAIAssistant();
  const allSelected = selectedOwners.length === teamMembers.length;
  return <div className="mt-3 border-t border-gray-200 pt-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-medium text-gray-700 flex items-center">
          <Users size={14} className="mr-1.5" />
          Filter by team member
        </h4>
      </div>
      <div className="space-y-1">
        <button onClick={allSelected ? unselectAllOwners : selectAllOwners} className="flex items-center w-full px-2 py-1.5 text-xs rounded-md hover:bg-gray-100 touch-manipulation">
          <div className={`w-4 h-4 mr-2 border rounded flex items-center justify-center ${allSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
            {allSelected && <Check size={10} className="text-white" />}
          </div>
          <span className="text-gray-700">All team members</span>
        </button>
        {teamMembers.map(member => {
        const isSelected = selectedOwners.includes(member.name);
        return <button key={member.id} onClick={() => toggleOwner(member.name)} className="flex items-center w-full px-2 py-1.5 text-xs rounded-md hover:bg-gray-100 touch-manipulation">
              <div className={`w-4 h-4 mr-2 border rounded flex items-center justify-center ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                {isSelected && <Check size={10} className="text-white" />}
              </div>
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full ${member.color} flex items-center justify-center text-white text-xs font-medium mr-2`}>
                  {member.avatar}
                </div>
                <span className="text-gray-700">{member.name}</span>
              </div>
            </button>;
      })}
      </div>
    </div>;
}