async function login(email: string, password: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/v1/auth/signin`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    },
  );
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }
  return response.json();
}

async function register(name: string, email: string, password: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/v1/auth/signup`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName: name, email, password }),
    },
  );
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }
  return response.json();
}

async function getBaseResume(token: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/v1/resumes/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }
  return response.json();
}

async function getPresignedPutUrl(token: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/v1/resumes/base/upload-url`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }
  return response.text();
}

async function uploadBaseResume(token: string, fileName: string) {
  console.log(JSON.stringify({ fileName }));
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/v1/resumes/me`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileName }),
    },
  );
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }
  return response.json();
}

async function parseJobUrlAndGenerateDraftApplication(
  token: string,
  url: string,
) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/v1/job-postings/parse`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    },
  );
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }
  return response.json();
}

export {
  login,
  register,
  getBaseResume,
  getPresignedPutUrl,
  uploadBaseResume,
  parseJobUrlAndGenerateDraftApplication,
};

//final-materials/${userId}/${applicationId}/resume/${randomUUID()}${ext}
//final-materials/${userId}/${applicationId}/cover-letter/${randomUUID()}${ext}

//resumes/${userId}/base-resume/${randomUUID}${ext}
