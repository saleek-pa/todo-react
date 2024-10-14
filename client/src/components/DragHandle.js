import React from 'react';
import { VscGripper } from 'react-icons/vsc';

const DragHandle = ({ className = '', ...props }) => (
  <div {...props} className={`cursor-move hover:bg-gray-200 p-1 rounded ${className}`}>
    <VscGripper className="text-gray-500 text-xl" />
  </div>
);

export default DragHandle;
