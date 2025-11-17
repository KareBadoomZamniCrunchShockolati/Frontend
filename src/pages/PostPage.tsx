import CustomButton from '@/components/Custom/CustomButton';
import TertiaryCustomButton from '@/components/Custom/TertiaryCustomButton';
import { posts } from '@/components/Profile/ProfilePosts';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, MessageCircle } from 'lucide-react';
import React from 'react'
import { useParams } from 'react-router-dom';

const PostPage = () => {
  
  const { id } = useParams();
  const postId = Number(id);
  const post = posts.find(p => p.id === postId)
  if(!post){
    return(
      <div>
        No post found with this id!
      </div>
    )
  }
    return (
    <div className="w-full flex justify-center p-4">
      <Card className="w-full max-w-md rounded-2xl shadow-lg overflow-hidden">
        {/* Image */}
        <div className="w-full">
          <img
            src={post.imageUrl}
            alt={post.text}
            className="w-full h-auto object-cover"
          />
        </div>

        <CardContent className="pt-4 space-y-4">

          {/* Like + Comment */}
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition">
              <Heart className="w-5 h-5" />
              <span>Like</span>
            </button>

            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition">
              <MessageCircle className="w-5 h-5" />
              <span>Comment</span>
            </button>
            <CustomButton>
              <MessageCircle className="w-5 h-5" />
              <span>Comment</span>
              </CustomButton>
          </div>

          {/* Caption */}
          <p className="text-gray-800 leading-relaxed" dir='rtl'>
            {post.text}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default PostPage