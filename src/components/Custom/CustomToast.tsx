import { warning } from "motion/react";
import { toast } from "sonner";

export default function CustomToast(
  message: string,
  mode: "success" | "error" | "warning" | "info" = "info",
) {
//   function ToastMessage(msg: string) {
//     return (
//       <div>
//         <p>{msg}</p>
//       </div>
//     );
//   }
  const errorOptions = {
    style: {
      direction: "rtl" as const,
      gap: "15px",
      boxShadow: `
    4px 4px 0 #ff004d,
    8px 8px 0 #3f0015
  `,
      border: "2px solid #ff004d",
      borderRadius: "8px",
      background: "#000000ff",
      color: "#ff004d",
      fontSize: "12px",
    },
  };
  const successOptions = {
    style: {
      direction: "rtl" as const,
      gap: "15px",
      boxShadow: `
    4px 4px 0 #00ff9c,
    8px 8px 0 #003f2e
  `,
      border: "2px solid #00ff9c",
      borderRadius: "8px",
      background: "#000000ff",
      color: "#00ff9c",
      fontSize: "12px",
    },
  };
  const warningOptions = {
    style: {
      direction: "rtl" as const,
      gap: "15px",
      boxShadow: `
    4px 4px 0 #ffd500,
    8px 8px 0 #3f3300
  `,
      border: "2px solid #ffd500",
      borderRadius: "8px",
      background: "#000000ff",
      color: "#ffd500",
      fontSize: "12px",
    },
  };
  const infoOptions = {
    style: {
      direction: "rtl" as const,
      gap: "15px",
      boxShadow: `
    4px 4px 0 #00c8ff,
    8px 8px 0 #003040
  `,
      border: "2px solid #00c8ff",
      borderRadius: "8px",
      background: "#000000ff",
      color: "#00c8ff",
      fontSize: "12px",
    },
  };
  switch (mode) {
    case "success":
      return toast.success(message, successOptions);
    case "error":
      return toast.error(message, errorOptions);
    case "warning":
      return toast.warning(message, warningOptions);
    case "info":
      return toast.info(message, infoOptions);
    default:
      return toast(message);
  }
}
