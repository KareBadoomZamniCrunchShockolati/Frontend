import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "../ui/input";
import CustomButton from "../Custom/CustomButton";
import CustomInput from "../Custom/CustomInput";
import { Form, Formik } from "formik";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

import CustomDropdown from "../Custom/CustomDropdown";
const ProfileChallenges = () => {
  const challenges = [
    { id: 1, name: "چالش یک",categoryID : 1 , category: "ورزشی" },
    { id: 2, name: "چالش دو", categoryID : 3 , category: "علمی" },
    { id: 3, name: "چالش سه", categoryID : 2 , category: "هنری" },
    { id: 4, name: "چالش چهار", categoryID : 4 , category: "تفریحی" },
  ];
  const categories = [
    { id: 1, name: "ورزشی" },
    { id: 2, name: "هنری" },
    { id: 3, name: "علمی" },
    { id: 4, name: "تفریحی" },
  ];
  const [checkedCategories, setCheckedCategories] = useState<{ [key: number]: boolean }>({});
  const selectedCategoryIds = Object.keys(checkedCategories)
  .filter((key) => checkedCategories[Number(key)])
  .map(Number);

const filteredChallenges =
  selectedCategoryIds.length === 0
    ? challenges
    : challenges.filter((ch) => selectedCategoryIds.includes(ch.categoryID)); 
  return (
    <>
      <div className="flex justify-start items-center m-2.5 gap-2 w-full">
        <Formik
          initialValues={{ challengeSearch: "" }}
          onSubmit={(values) => console.log(values)}
        >
          {({ isSubmitting }) => (
            <Form className="relative w-72 flex items-center">
              <CustomInput
                icon={<Search className="text-[var(--color-blue-main)]" />}
                name="challengeSearch"
                label="جستجو"
                className="pr-10" // add padding-right so text doesn't overlap button
              />

            </Form>
          )}
        </Formik>
        <CustomDropdown
          items={categories}
          checkedCategories={checkedCategories}
          setCheckedCategories={setCheckedCategories}
        ></CustomDropdown>
      </div>
      {filteredChallenges.map((challenge) => (
        <Card
          className="cursor-pointer m-2.5"
          onClick={() => console.log("meowww and move me to the page")}
        >
          <CardHeader>
            <CardTitle>{challenge.name}</CardTitle>
            <CardDescription>{challenge.category}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>meow</p>
          </CardContent>
          <CardFooter>
            <p>Click to participate</p>
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

export default ProfileChallenges;
