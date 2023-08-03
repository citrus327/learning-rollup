const pause = async (time: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

const taskA = async () => {
  await pause(1000);
  console.log("taskA finished");
  return "A";
};

const taskB = async () => {
  await pause(500);
  console.log("taskB finished");
  return "B";
};

const taskC = async () => {
  await pause(1500);
  console.log("taskC finished");
  return "C";
};

const exe = async () => {
  const tasks = [taskA, taskB, taskC];

  for (let i = 0; i < tasks.length; i++) {
    let curr = tasks[i];
    await curr();
  }

  process.exit(0);
};

exe();
