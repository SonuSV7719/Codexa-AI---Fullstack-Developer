import React from 'react'

interface ChatsProps {
  messages: { sender: "user" | "AI"; text: string }[]; // Messages array
}

const Chats: React.FC<ChatsProps> = ({ messages }) => {
  if (!messages || messages.length === 0) return null;

  return (
    <div className=' flex flex-col gap-5'>
      {messages.map((msg, index) => (
        <div
          key={index}
          className="chat-message p-4 rounded-lg border border-slate-500 bg-bg-secondary"
        >
          <div className="font-bold text-blue-500">
            {msg.sender === "user" ? "You:" : "AI:"}
          </div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore fugit unde accusantium corporis assumenda ipsam natus modi adipisci atque, distinctio tempore ullam, minus quidem, libero earum fuga eos. Eaque culpa possimus consectetur cupiditate illo facere ad deserunt perferendis. Laboriosam earum consequuntur accusamus adipisci dolore inventore impedit doloremque quam enim excepturi tempora obcaecati, illo, modi dolor quos. Numquam explicabo quo accusantium reiciendis dolorum nesciunt debitis at ipsum quibusdam est! Veritatis repudiandae magnam eligendi ducimus commodi beatae suscipit laborum deleniti! Eos omnis similique rem et iusto fuga, deleniti ad asperiores voluptatem natus provident veritatis officiis deserunt itaque dolorum velit eum? Alias amet, ducimus eius reiciendis eum commodi quia quibusdam accusamus illum quaerat, dicta facere dolores dolorem! Nulla eaque eligendi reprehenderit praesentium ut reiciendis eum minima mollitia? Aliquid, molestiae fugiat voluptatum doloremque velit, commodi repudiandae dolorem alias odio in facilis aliquam possimus. Perferendis veniam ipsam corporis quae vitae nobis consequatur nisi reprehenderit tempore ratione impedit eaque earum sint harum eveniet totam doloremque, dolorem soluta in. Dolorem obcaecati eius facere neque nisi rerum amet culpa, praesentium maxime, distinctio, consequatur hic est impedit debitis eaque necessitatibus accusantium blanditiis. Quos alias voluptatum rerum id quam harum quidem assumenda at exercitationem saepe. Perspiciatis porro ducimus ratione enim voluptatum nemo voluptatem facilis ex mollitia? Unde velit illo repellendus? Aliquid esse illum alias asperiores odit iure repellendus, harum vero inventore doloribus ullam, repudiandae, dignissimos eum natus. Asperiores, quisquam ipsa tempore deleniti voluptate iure quo autem blanditiis repellendus, nam eaque sed quam eos, facilis ipsum vero aperiam explicabo. Nulla neque, magni, veritatis unde nihil optio repellendus assumenda voluptate veniam a explicabo odio maxime et rerum dolore nobis consectetur, quisquam culpa. Impedit iure numquam iste deleniti assumenda nemo pariatur expedita velit. Est fuga voluptas exercitationem quis animi atque dolores minus dignissimos debitis nesciunt recusandae veritatis quaerat, doloremque aspernatur culpa aliquam impedit.
          <p className="text-white">{msg.text}</p>
        </div>
      ))}
    </div>
  );
};

export default Chats;
