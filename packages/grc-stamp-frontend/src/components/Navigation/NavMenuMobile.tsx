import React, { useEffect, useState } from 'react';

export function NavMenuMobile() {
  const [isOpened, setOpened] = useState(false);

  useEffect(() => () => {
    // Component will unmount
    setOpened(false);
  });

  return (
    <div>{ isOpened }</div>
  );
}
