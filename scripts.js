document.getElementById('readyButton').addEventListener('click', function() {
    const box1 = document.getElementById('box1').value;
    const activitiesArray = box1.split(';');
    const activities = [];

    class Activity {
        constructor(name, duration) {
            this.name = name;
            this.duration = parseInt(duration); // Store duration in minutes
        }
    }

    activitiesArray.forEach(activityStr => {
        if (activityStr.trim() !== "") {
            const [name, duration] = activityStr.split('=');
            if (name && duration) {
                const activity = new Activity(name.trim(), duration.trim());
                activities.push(activity);
            }
        }
    });

    document.getElementById('activitiesOutput').textContent = JSON.stringify(activities, null, 2);
    console.log(activities);
});

document.getElementById('goButton').addEventListener('click', function() {
    const box2 = document.getElementById('box2').value;
    const activities = JSON.parse(document.getElementById('activitiesOutput').textContent || "[]");

    if (!box2.includes('start')) {
        alert('It is necessary to specify a start time.');
        return;
    }

    const scheduleArray = box2.split(';').map(str => str.trim()).filter(str => str !== "");
    const schedule = [];
    let lastTime = null;

    function addMinutesToTime(time, minutes) {
        const [hour, minute] = time.split(':').map(Number);
        const totalMinutes = hour * 60 + minute + minutes;
        const newHour = Math.floor(totalMinutes / 60);
        const newMinute = totalMinutes % 60;
        return `${String(newHour).padStart(2, '0')}:${String(newMinute).padStart(2, '0')}`;
    }

    scheduleArray.forEach(scheduleStr => {
        if (scheduleStr.startsWith('start')) {
            const parts = scheduleStr.split(' ');
            const time = parts[1];
            const activityName = parts.slice(2).join(' ');
            schedule.push(`${time} ${activityName}`);
            lastTime = time;
        } else {
            const activityName = scheduleStr;
            const lastActivity = schedule[schedule.length - 1];
            if (lastActivity) {
                const [lastActivityTime, ...lastActivityName] = lastActivity.split(' ');
                const activity = activities.find(a => a.name === lastActivityName.join(' '));
                if (activity) {
                    const newTime = addMinutesToTime(lastActivityTime, activity.duration);
                    schedule.push(`${newTime} ${activityName}`);
                    lastTime = newTime;
                }
            }
        }
    });

    document.getElementById('scheduleOutput').textContent = schedule.join('\n');
    console.log(schedule);
});
