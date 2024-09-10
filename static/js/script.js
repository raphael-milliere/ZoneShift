document.addEventListener('DOMContentLoaded', () => {
    const referenceLocation = document.getElementById('reference-location');
    const referenceDate = document.getElementById('reference-date');
    const referenceTime = document.getElementById('reference-time');
    const convertBtn = document.getElementById('convert-btn');
    const resultsDiv = document.getElementById('results');
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    const locations = [
        { name: 'Sydney, Australia', timezone: 'Australia/Sydney' },
        { name: 'New York, USA', timezone: 'America/New_York' },
        { name: 'San Francisco, USA', timezone: 'America/Los_Angeles' },
        { name: 'London, UK', timezone: 'Europe/London' },
        { name: 'Paris, France', timezone: 'Europe/Paris' }
    ];

    // Set default date to today
    referenceDate.valueAsDate = new Date();

    // Set default time to current time
    const now = new Date();
    referenceTime.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    convertBtn.addEventListener('click', convertTime);
    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }

    function convertTime() {
        const selectedTimezone = referenceLocation.value;
        const selectedDate = referenceDate.value;
        const selectedTime = referenceTime.value;
        
        if (!selectedTime) {
            alert('Please select a time');
            return;
        }

        if (!selectedDate) {
            alert('Please select a date');
            return;
        }

        const [year, month, day] = selectedDate.split('-');
        const [hours, minutes] = selectedTime.split(':');
        const referenceDateTime = moment.tz(`${year}-${month}-${day} ${hours}:${minutes}`, selectedTimezone);

        let resultsHTML = `
            <h2>Snapshot View</h2>
            <div id="snapshot-view">
                ${updateSnapshotView(referenceDateTime, selectedTimezone)}
            </div>
            <h2>Annual Time Shifts</h2>
            <div id="annual-time-shifts">
                ${updateAnnualTimeShifts(referenceDateTime, selectedTimezone)}
            </div>
        `;

        resultsDiv.innerHTML = resultsHTML;
    }

    function updateSnapshotView(referenceDateTime, selectedTimezone) {
        let resultsHTML = '';

        locations.forEach(location => {
            if (location.timezone !== selectedTimezone) {
                const convertedTime = referenceDateTime.clone().tz(location.timezone);
                const formattedTime = convertedTime.format('h:mm A');
                const formattedDate = convertedTime.format('MMMM D, YYYY');
                const timeDiff = convertedTime.utcOffset() - referenceDateTime.utcOffset();
                const timeDiffFormatted = formatTimeDiff(timeDiff);

                resultsHTML += `
                    <div class="result-item">
                        <h3>${location.name}</h3>
                        <p><strong>Date:</strong> ${formattedDate}</p>
                        <p><strong>Time:</strong> ${formattedTime}</p>
                        <p><strong>Time Difference:</strong> ${timeDiffFormatted}</p>
                    </div>
                `;
            }
        });

        return resultsHTML;
    }

    function updateAnnualTimeShifts(referenceDateTime, selectedTimezone) {
        let resultsHTML = '';
        const referenceLocation = locations.find(loc => loc.timezone === selectedTimezone);

        locations.forEach(location => {
            if (location.timezone !== selectedTimezone) {
                resultsHTML += `<div class="yearly-result-item"><h3>${location.name}</h3><ul>`;

                let prevTimeDiff = null;
                let prevReferenceDST = referenceDateTime.clone().tz(selectedTimezone).isDST();
                let prevLocationDST = referenceDateTime.clone().tz(location.timezone).isDST();

                for (let i = 0; i < 365; i++) {
                    const date = referenceDateTime.clone().add(i, 'days');
                    const convertedTime = date.clone().tz(location.timezone);
                    const timeDiff = convertedTime.utcOffset() - date.utcOffset();

                    const newReferenceDST = date.clone().tz(selectedTimezone).isDST();
                    const newLocationDST = convertedTime.isDST();

                    if (prevTimeDiff === null || timeDiff !== prevTimeDiff || prevReferenceDST !== newReferenceDST || prevLocationDST !== newLocationDST) {
                        const formattedDate = date.format('MMMM D, YYYY');
                        const formattedTime = convertedTime.format('h:mm A');
                        const timeDiffFormatted = formatTimeDiff(timeDiff);
                        
                        let dstChange = '';
                        if (prevReferenceDST !== newReferenceDST) {
                            dstChange += newReferenceDST 
                                ? `${referenceLocation.name} enters DST. ` 
                                : `${referenceLocation.name} exits DST. `;
                        }
                        if (prevLocationDST !== newLocationDST) {
                            dstChange += newLocationDST 
                                ? `${location.name} enters DST. ` 
                                : `${location.name} exits DST. `;
                        }

                        resultsHTML += `<li><strong>${formattedDate}:</strong> ${formattedTime} (${timeDiffFormatted}) ${dstChange}</li>`;
                        
                        prevTimeDiff = timeDiff;
                        prevReferenceDST = newReferenceDST;
                        prevLocationDST = newLocationDST;
                    }
                }

                resultsHTML += '</ul></div>';
            }
        });

        return resultsHTML;
    }

    function formatTimeDiff(timeDiff) {
        const hours = Math.floor(Math.abs(timeDiff) / 60);
        const minutes = Math.abs(timeDiff) % 60;
        return `${timeDiff >= 0 ? '+' : '-'}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    }
});