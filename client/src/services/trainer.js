export const fetchTrainersBySchoolId = schoolId =>
    fetch(`/trainers/?idSchool=${schoolId}`).then(res => res.json());

export const fetchTrainerById = id => fetch(`/trainers/${id}`).then(res => res.json());

export const saveTrainer = data =>
    fetch('/saveTrainer', {
        method: 'post',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

export const editTrainer = data =>
    fetch('/editTrainer', {
        method: 'post',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
