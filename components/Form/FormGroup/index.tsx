import React from "react";

interface IFormGroup {
    children: React.ReactNode;
    direction?: 'row' | 'col';
}

export const FormGroup = ({ children, direction = 'col' }: IFormGroup) => (
    <div className={`flex flex-1 w-full ${direction === 'col' ? 'flex-col gap-2' : 'flex-row gap-3'}`}>
        {children}
    </div>
);