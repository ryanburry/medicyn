import schedule from "node-schedule";

const scheduleMedicationCheck = (medications) => {
  const job = schedule.scheduleJob("* * * * *", () => {
    console.log("Checking times");
    checkDispenseTime(medications);
  });

  return job;
};

const checkDispenseTime = (medications) => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  medications.forEach((medication) => {
    const [hour, minute] = medication.dispenseTime.split(":");
    if (parseInt(hour) === currentHour && parseInt(minute) === currentMinute) {
      // Trigger dispensing function for this medication
      console.log(
        `Dispensing ${medication.name} at ${medication.dispenseTime}`
      );
    }
  });
};

export { scheduleMedicationCheck };
