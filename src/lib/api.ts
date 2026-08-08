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

export { login, register, getBaseResume, getPresignedPutUrl };

//final-materials/${userId}/${applicationId}/resume/${randomUUID()}${ext}
//final-materials/${userId}/${applicationId}/cover-letter/${randomUUID()}${ext}

//resumes/${userId}/base-resume/${randomUUID}${ext}
