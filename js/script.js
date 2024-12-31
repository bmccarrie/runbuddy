document
  .getElementById('raceForm')
  .addEventListener('submit', function (event) {
    event.preventDefault();

    const form = document.getElementById('raceForm');
    const resultContainer = document.getElementById('resultContainer');

    form.style.display = 'none';

    const today = new Date();
    const todayStr = today.toDateString();

    const raceDayInput = document.getElementById('raceDay').value;
    const raceDay = new Date(raceDayInput + 'T00:00:00');
    const raceDayStr = raceDay.toDateString();

    const raceDistance = document.getElementById('raceDistance').value;
    const timeDiff = raceDay - today;
    const daysToRace = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;

    const planDurations = {
      '5K': 56,
      '10K': 56,
      half: 84,
      marathon: 126,
    };

    const planDuration = planDurations[raceDistance];
    let message;
    let startIndex = 0;
    let extraDays = 0;

    if (daysToRace >= planDuration) {
      extraDays = daysToRace - planDuration;
      message = `Your program includes ${extraDays} days of Base training.`;
    } else {
      startIndex = planDuration - daysToRace;
      message = `Warning: You do not have enough time to complete the entire ${raceDistance} program. Starting from day ${
        startIndex + 1
      }.`;
    }

    let jsonFile;
    switch (raceDistance) {
      case '5K':
        jsonFile = '5kPlan.json';
        break;
      case '10K':
        jsonFile = '10kPlan.json';
        break;
      case 'half':
        jsonFile = 'halfPlan.json';
        break;
      case 'marathon':
        jsonFile = 'marathonPlan.json';
        break;
      default:
        console.error('Unknown race distance selected.');
        return;
    }

    Promise.all([
      fetch(jsonFile).then((response) => response.json()),
      fetch('basePlan.json').then((response) => response.json()),
    ])
      .then(([planData, basePlan]) => {
        trainingPlan = []; // Clear and prepare the trainingPlan array
        const dateList = [];
        let baseDayCounter = 1;

        for (let i = 0; i < daysToRace; i++) {
          const currentDate = new Date(today);
          currentDate.setDate(today.getDate() + i);

          if (i < extraDays) {
            // Base Plan Activities
            const baseIndex = i % basePlan.length;
            const activity = basePlan[baseIndex].activity;
            const type = basePlan[baseIndex].type;

            // Add to dateList for rendering in the DOM
            dateList.push(
              `<li class="${type}">Base Day ${baseDayCounter} - ${currentDate.toDateString()}: ${activity}</li>`
            );

            // Add to trainingPlan for the ICS file
            trainingPlan.push({
              date: currentDate.toISOString().split('T')[0],
              activity: activity,
              type: type,
            });

            baseDayCounter++;
          } else {
            // Main Training Plan Activities
            const planIndex = (i - extraDays + startIndex) % planData.length;
            const activity = planData[planIndex].activity;
            const dayNumber = planData[planIndex].day;
            const type = planData[planIndex].type;

            // Add to dateList for rendering in the DOM
            dateList.push(
              `<li class="${type}">Day ${dayNumber} - ${currentDate.toDateString()}: ${activity}</li>`
            );

            // Add to trainingPlan for the ICS file
            trainingPlan.push({
              date: currentDate.toISOString().split('T')[0],
              activity: activity,
              type: type,
            });
          }
        }

        // Debugging: Log the trainingPlan to verify it's populated
        console.log('Training Plan (script.js):', trainingPlan);

        // Update the result container with the plan details
        resultContainer.innerHTML = `
          <div><h2>You've selected the ${raceDistance} program!</h2></div>
          <div><strong>Today's Date:</strong> ${todayStr} <br><strong>Race Date:</strong> ${raceDayStr}</div>
          <div><strong>Days until race:</strong> ${daysToRace - 1}</div>
          <div><strong>Message:</strong> ${message}</div>
          <div>
              <button id="resetButton" class="reset-button">Select Another Program</button>
          </div>
          <div><strong>Your Program:</strong></div>
          <ul>${dateList.join('')}</ul>
      `;

        // Make the results visible
        resultContainer.style.display = 'block';

        // Add the "Add to Calendar" button dynamically
        resultContainer.innerHTML += `
          <div>
              <button id="addToCalendar" class="btn btn-success mt-3">Add to Calendar</button>
          </div>
      `;

        // Attach the calendar functionality after rendering the button
        attachCalendarEvent('addToCalendar', trainingPlan);

        // Reset button functionality
        document
          .getElementById('resetButton')
          .addEventListener('click', function () {
            resultContainer.style.display = 'none';
            form.style.display = 'block';
          });
      })
      .catch((error) => console.error('Error loading JSON:', error));
  });
