import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "@/layouts/PublicLayout/PublicLayout";
import Landing from "@/pages/Landing";
import Temp from "@/pages/Temp";
import PrivateLayout from "@/layouts/PrivateLayout/PrivateLayout";
import DashBoard from "@/components/Custom/Profile/DashBoard";
import FollowBar from "@/components/Custom/Profile/FollowBar";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <PublicLayout />,
		// errorElement: (
		// 	<Error404 />
		// ),
		children: [
			{
				index: true,
				element: <Landing />,
			},
			{
				path: "/temp",
				element: <Temp />,
			},
			// {
			// 	path: "/AboutUs",
			// 	element: <AboutUs />,
			// },
			// {
		],
	},
	{
		element: <PrivateLayout />,
		children: [
			// {
			// 	path: "/EditProfile",
			// 	element: <EditProfile />,
			// },
			{
				path: "/DashBoard", //  /:username
				element: <DashBoard />,
			},
		],
	},
	// {
	// 	element: <AnotherLayout />,
	// 	children: [
	// 		{
	// 			path: "/login",
	// 			element: <Login />,
	// 		},
	// 		{
	// 			path: "/temp",
	// 			element: <Temp />,
	// 		},
	// 	],
	// },
]);
