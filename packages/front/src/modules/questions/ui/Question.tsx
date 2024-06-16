type Props = {
  text?: string;
};
const Question = ( { text }: Props) => {
  const textPart = text && <p>{text}</p>;

  return (
    <div>
      <p>Question</p>
      {textPart}
    </div>
  );
};

export default Question;
