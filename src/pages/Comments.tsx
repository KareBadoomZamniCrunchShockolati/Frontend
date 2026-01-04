import CustomButton from "@/components/Custom/CustomButton";
import CustomToast from "@/components/Custom/CustomToast";
import LoadingPage from "@/components/Custom/LoadingPage";
import useUserStore from "@/store/userStore/userStore";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomInput from "@/components/Custom/CustomInput";
import { Form, Formik, type FormikHelpers } from "formik";
import CommentCard from "@/components/Custom/CommentCard";
import {
  CommentChallengeService,
  CommentPostService,
  GetCommentsChallengeService,
  GetCommentsPostService,
} from "@/services/commentService";
import { getBackendErrorMessage } from "@/services/errorService";

interface props {
  entityType: "challenge" | "post";
}

const Comments = ({ entityType }: props) => {
  const { id } = useParams();
  const entityId = Number(id);
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchComments = async () => {
    try {
      if (entityType === "challenge") {
        const res = await GetCommentsChallengeService(entityId);
        setComments(Array.isArray(res) ? res : []);
      } else {
        const res = await GetCommentsPostService(entityId);
        setComments(Array.isArray(res) ? res : []);
      }
    } catch (err) {
      CustomToast(getBackendErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [entityId]);

  const handleSubmitComment = async (
    values: { commentText: string },
    { resetForm }: FormikHelpers<{ commentText: string }>
  ) => {
    try {
      if (entityType === "challenge") {
        await CommentChallengeService({
          entity_type: entityType,
          entity_id: entityId,
          content: values.commentText,
        });
      } else {
        await CommentPostService({
          entity_type: entityType,
          entity_id: entityId,
          content: values.commentText,
        });
      }
      CustomToast("نظر با موفقیت ایجاد شد!", "success");
      fetchComments();
      resetForm();
    } catch (error) {
      CustomToast(getBackendErrorMessage(error), "error");
    }
  };

  if (loading) return <LoadingPage />;

  if (error) return <div className="text-center text-destructive mt-10">{error}</div>;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
      <div className="px-[var(--side-page)] pt-[var(--top-page)] pb-4">
        <div className="flex items-center justify-between mb-6">
          <button
            className="p-2 border-2 border-foreground rounded-xl hover:bg-muted transition-colors"
            onClick={() => navigate(`/${entityType}/${entityId}`)}
          >
            <ArrowLeft className="w-8 h-8 text-primary" />
          </button>

          <p className="text-center font-bold text-title text-primary">
            نظرات {entityType === "challenge" ? "چالش" : "پست"}
          </p>
        </div>

        <Formik
          initialValues={{ commentText: "" }}
          onSubmit={handleSubmitComment}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit} className="w-full">
              <div className="flex items-center gap-2">
                <CustomInput
                  width="w-full"
                  name="commentText"
                  label="نظر"
                  className="bg-card"
                />
                <CustomButton
                  type="submit"
                  className="bg-secondary hover:bg-secondary-hover whitespace-nowrap"
                >
                  ارسال نظر
                </CustomButton>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      <div className="flex-1 flex flex-col gap-[var(--comment-gap)] px-[var(--side-page)] pb-[var(--top-page)]">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground font-medium mt-10">
            هنوز نظری ثبت نشده است!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              refreshComments={fetchComments}
              entityType={entityType}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;