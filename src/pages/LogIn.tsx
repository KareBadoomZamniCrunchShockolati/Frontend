import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import CustomInput from "@/components/Custom/CustomInput";
import CustomBtn from "@/components/Custom/CustomBtn";
export default function Login() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = (data: any) => console.log(data);
  return (
    <div className="w-screen h-screen flex justify-center items-center ">
      <div className="flex flex-col justify-around bg-white w-[440px] h-[410px] p-[6px] rounded-[15px] py-[20px]">
        <h1 className="text-center font-bold text-[30px] mt-[20px] text-[#000]">
          خوش اومدی
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-80 space-y-8  mx-auto"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl className="text-right ">
                    <CustomInput {...field} type="email" placeholder="ایمیل" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl className="text-right ">
                    <CustomInput
                      {...field}
                      type="password"
                      placeholder="رمز ورود"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CustomBtn
              className="w-full bg-[#ff7700] text-[#000] mt-auto"
              type="submit"
            >
              ورود
            </CustomBtn>
          </form>
        </Form>
      </div>
    </div>
  );
}
