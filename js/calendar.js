function generateICS(trainingPlan) {
  if (!trainingPlan || trainingPlan.length === 0) {
    console.error('Training plan is empty. No events to add.');
    return;
  }

  let icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\n`;

  trainingPlan.forEach((event) => {
    // Log each event being processed
    console.log('Processing event:', event);

    if (!event.date || !event.activity) {
      console.error('Invalid event data:', event);
      return;
    }

    const startDate = event.date.replace(/-/g, '') + 'T080000Z'; // Format: YYYYMMDDTHHMMSSZ
    const endDate = event.date.replace(/-/g, '') + 'T090000Z'; // 1-hour event
    const summary = event.activity;
    const description =
      event.type === 'rest' ? 'Take a rest day!' : 'Training activity.';

    icsContent += `BEGIN:VEVENT\n`;
    icsContent += `SUMMARY:${summary}\n`;
    icsContent += `DTSTART:${startDate}\n`;
    icsContent += `DTEND:${endDate}\n`;
    icsContent += `DESCRIPTION:${description}\n`;
    icsContent += `END:VEVENT\n`;
  });

  icsContent += `END:VCALENDAR`;

  // Log the final ICS content
  console.log('Generated ICS Content:\n', icsContent);

  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'training-plan.ics';
  downloadLink.click();
  URL.revokeObjectURL(url);
}

function attachCalendarEvent(buttonId, trainingPlan) {
  document.getElementById(buttonId).addEventListener('click', function () {
    console.log('Add to Calendar button clicked!'); // Debugging log
    generateICS(trainingPlan);
  });
}
