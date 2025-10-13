import CustomInput  from "@/components/Custom/CustomInput";
import { Button } from "@/components/ui/button";

function SignUp() {
	return (
		<div className="w-full h-screen flex flex-col items-center justify-center gap-4 bg-white dark:bg-background">
			<h1 className="text-3xl font-bold mb-4 text-gray-800">
				Welcome to My App 🚀
			</h1>

			<div className="flex items-center gap-2">
				<CustomInput
					className=""
				/>
				<Button>Submit</Button>
			</div>
		</div>
	);
}

export default SignUp;
