import React from 'react';

export default function Avatar({ name }) {
  return (
    <div className="avatar">
      <div className="avatar__letters">{name}</div>
    </div>
  );
}
