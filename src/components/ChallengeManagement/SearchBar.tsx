// src/components/Custom/SearchBar.tsx
import React from 'react';
import { Field, Form, Formik } from 'formik';
import CustomInput from '@/components/Custom/CustomInput';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchTermChange }) => {
  return (
    <Formik initialValues={{ searchTerm }} onSubmit={() => {}}>
      {({ values, handleChange, handleBlur }) => (
        <Form className="flex justify-center w-full max-w-xl">
          <Field
            name="searchTerm"
            render={({ field }: any) => (
              <CustomInput
                {...field}
                icon={<Search />}
                value={values.searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(e);
                  onSearchTermChange(e.target.value);
                }}
                onBlur={handleBlur}
                label="جستجو"
                width="w-full"
                className="rounded-[8px]"
              />
            )}
          />
        </Form>
      )}
    </Formik>
  );
};

export default SearchBar;
