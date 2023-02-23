const shiftsRates = [
    {
        start: "00:01",
        end: "09:00",
        normalRate: 25,
        weekendRate: 30,
    },
    {
        start: "09:01",
        end: "18:00",
        normalRate: 15,
        weekendRate: 20,
    },
    {
        start: "18:01",
        // replaced 00:00 with 24:00 so the native < operator can be used
        end: "24:00",
        normalRate: 20,
        weekendRate: 25,
    },
];

const weekendCodes = ["SA", "SU"];

window.onload = () => {
    const fileInput = document.getElementById("file_input");
    const resetButton = document.getElementById("reset_button");

    resetButton?.addEventListener("click", onReset);
    fileInput?.addEventListener("change", handleFileUpload);
};

const handleFileUpload = (event) => {
    const employeesAndTotals = [];
    const file = event.target?.files[0];
    if (!file) return;
    if (file.type !== "text/plain") {
        alert("Only .txt/.text files are allowed");
        fileInput.value = null;
    }

    const reader = new FileReader();
    reader.onload = () => {
        // splitting the input in lines and removing the carriage return
        const lines = reader.result
            .split("\n")
            .map((line) => line.trim().replace("\r", ""));

        const regex =
            /^[\w-]+=((MO|TU|WE|TH|FR|SA|SU)([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)(,(MO|TU|WE|TH|FR|SA|SU)([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d))*)$/;

        for (const line of lines) {
            const match = regex.exec(line);
            if (!match) alert(`Invalid line: ${line}`);

            const splitLine = line.split("=");
            const employee = splitLine[0];
            const shifts = splitLine[1].split(",");
            for (const shift of shifts) {
                const day = shift.substring(0, 2);
                const start = shift.substring(2, 7);
                const end = shift.substring(8, 13);

                const isWeekend = weekendCodes.includes(day);
                const rate = shiftsRates.find(
                    (shiftRate) =>
                        start >= shiftRate.start && end <= shiftRate.end
                );

                // considered using a default day but this way i take into account edge cases where shift starts in one day and ends in another one
                const startDate = new Date(
                    `2023-01-${getDate(day)}T${start}:00`
                );
                const endDate = new Date(`2023-01-${getDate(day)}T${end}:00`);
                const diffInMs = endDate - startDate;
                const diffInHours = diffInMs / (1000 * 60 * 60);

                let total = 0;

                // not having a rate at this point means that the shift is not in the range of any of the shiftsRates, so it must be split in two
                if (rate) {
                    total += isWeekend
                        ? diffInHours * rate.weekendRate
                        : diffInHours * rate.normalRate;
                } else {
                    const startRate = shiftsRates.find(
                        (shiftRate) =>
                            start >= shiftRate.start && start <= shiftRate.end
                    );
                    const endRate = shiftsRates.find(
                        (shiftRate) =>
                            end <= shiftRate.end && end >= shiftRate.start
                    );

                    const startDiffInMs =
                        new Date(
                            `2023-01-${getDate(day)}T${startRate.end}:00`
                        ) - startDate;
                    const startDiffInHours = startDiffInMs / (1000 * 60 * 60);

                    const endDiffInMs =
                        endDate -
                        new Date(`2023-01-${getDate(day)}T${endRate.start}:00`);
                    const endDiffInHours = endDiffInMs / (1000 * 60 * 60);

                    const startRateTotal = isWeekend
                        ? startDiffInHours * startRate.weekendRate
                        : startDiffInHours * startRate.normalRate;
                    const endRateTotal = isWeekend
                        ? endDiffInHours * endRate.weekendRate
                        : endDiffInHours * endRate.normalRate;

                    total += startRateTotal + endRateTotal;
                }

                const employeeIndex = employeesAndTotals.findIndex(
                    (employeeAndTotal) => employeeAndTotal.employee === employee
                );

                if (employeeIndex === -1) {
                    employeesAndTotals.push({
                        employee,
                        total,
                    });
                } else {
                    employeesAndTotals[employeeIndex].total += total;
                }
            }
        }

        if (!employeesAndTotals.length) return;

        toggleNoFileWarning();

        const employeesListContainer =
            document.getElementById("employees_list");
        for (const employeeAndTotal of employeesAndTotals) {
            const listItem = document.createElement("li");
            listItem.innerText = `${employeeAndTotal.employee}: $${Math.round(
                employeeAndTotal.total
            )}`;
            employeesListContainer?.appendChild(listItem);
        }
    };

    reader.readAsText(file);
};

const toggleNoFileWarning = () => {
    const noFileWarning = document.getElementById("no_file_warning");
    noFileWarning.hidden = !noFileWarning.hidden;
};

const onReset = () => {
    const fileInput = document.getElementById("file_input");
    const employeesListContainer = document.getElementById("employees_list");
    employeesListContainer.innerHTML = "";
    fileInput.value = null;
    toggleNoFileWarning();
};

const getDate = (day) => {
    const daysOfWeek = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
    const dayIndex = daysOfWeek.indexOf(day);
    const date = new Date(`2023-01-01`);
    const diffInDays = dayIndex - date.getDay();
    date.setDate(date.getDate() + diffInDays);
    return date.getDate();
};
