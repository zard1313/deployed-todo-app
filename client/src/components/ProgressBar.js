const ProgressBar = ({ progress }) => {
  const colors =[
    "rgb(255, 214, 161)",
    "rgb(255, 275, 163)",
    "rgb(108, 115, 148)",
    "rgb(141, 181, 145)"
  ];

  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  // let randomNumber = Math.random();
  // let i = randomNumber * colors.length;
  // let j = (Math.floor(i));
  // let randomColor = colors[j];

  // console.log("randomNumber: " + randomNumber);
  // console.log("colors.length: " + colors.length);
  // console.log("i: " + i);
  // console.log("floor: " + j);
  // console.log("randomColor: " + randomColor);

  return (
    <div className="outer-bar">
      <div className="inner-bar"
        style={{width: `${progress}%`, backgroundColor: randomColor}}
      ></div>
    </div>
  );
}

export default ProgressBar;
  