import React from 'react';

interface WrapperProps {
  children?: React.ReactNode;
}

const PageActions: React.FC<WrapperProps> = ({ children }) => {
  return (
    <section
      id='action-section'
      className='flex flex-row flex-wrap w-ful h-max gap-2 justify-start items-center mb-5 mt-5 w-full'
    >
      {children}
    </section>
  );
};

export default PageActions;
