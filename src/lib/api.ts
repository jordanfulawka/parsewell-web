import type { Application } from './types';

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();
    console.log(response);
    if (data?.error) return data.error;
  } catch {
    // response body wasn't JSON (e.g. proxy/HTML error page, empty body)
  }
  return `Request failed (${response.status} ${response.statusText})`;
}

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
    throw new Error(await getErrorMessage(response));
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
    throw new Error(await getErrorMessage(response));
  }
  return response.json();
}

async function checkTokenValidation(token: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/v1/auth/validate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    },
  );
  if (!response.ok) {
    return { valid: false };
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
    throw new Error(await getErrorMessage(response));
  }
  if (response.status == 204) {
    return null;
  }
  return response.json();
}

async function getBaseResumePresignedPutUrl(token: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/v1/resumes/base/upload-url`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
  return response.text();
}

async function getBaseResumePresignedGetUrl(token: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/v1/resumes/base/download-url`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
  return response.text();
}

async function getFinalMaterialPresignedPutUrl(
  token: string,
  applicationId: string,
  type: string,
) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/v1/applications/${applicationId}/materials/upload-url?type=${type}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
  return response.text();
}

async function getFinalMaterialPresignedGetUrl(
  token: string,
  applicationId: string,
  type: string,
) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/v1/applications/${applicationId}/materials/download-url?type=${type}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
  return response.text();
}

async function getApplications(token: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/v1/applications`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
  return response.json();
}

async function uploadBaseResume(token: string, fileName: string) {
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
    throw new Error(await getErrorMessage(response));
  }
  return response.json();
}

async function deleteBaseResume(token: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/v1/resumes/me`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
  return response.json();
}

async function uploadResume(
  token: string,
  applicationId: string,
  fileName: string,
) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/v1/applications/${applicationId}/upload-resume`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileName }),
    },
  );
  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
  return response.json();
}

async function uploadCoverLetter(
  token: string,
  applicationId: string,
  fileName: string,
) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/v1/applications/${applicationId}/upload-cover-letter`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileName }),
    },
  );
  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
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
    throw new Error(await getErrorMessage(response));
  }
  return response.json();
}

async function createApplication(token: string, application: Application) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/v1/applications`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(application),
    },
  );
  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
  return response.json();
}

async function updateApplication(token: string, application: Application) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/v1/applications/${application.id}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(application),
    },
  );
  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
  return response.json();
}

async function getApplicationById(token: string, applicationId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/v1/applications/${applicationId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
  return response.json();
}

async function generateResumeEdits(token: string, applicationId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/v1/applications/${applicationId}/generate-edits`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
  return response.json();
}

async function generateCoverLetter(token: string, applicationId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/v1/applications/${applicationId}/generate-cover-letter`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
  return response.json();
}

async function getCoverLetter(token: string, applicationId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/v1/applications/${applicationId}/cover-letter`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
  return response.json();
}

async function getEditSuggestions(token: string, applicationId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/v1/applications/${applicationId}/edits`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
  return response.json();
}

async function createApplicationRequest(token: string, jobInformation: any) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/v1/applications/create-request`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobInformation),
    },
  );
  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
  return response.json();
}

async function getFinalMaterials(token: string, applicationId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/v1/applications/${applicationId}/materials`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
  return response.json();
}

export {
  login,
  register,
  getBaseResume,
  getBaseResumePresignedPutUrl,
  uploadBaseResume,
  parseJobUrlAndGenerateDraftApplication,
  getApplicationById,
  generateResumeEdits,
  createApplication,
  updateApplication,
  getEditSuggestions,
  getApplications,
  createApplicationRequest,
  generateCoverLetter,
  getCoverLetter,
  getFinalMaterialPresignedPutUrl,
  uploadResume,
  uploadCoverLetter,
  getFinalMaterials,
  getBaseResumePresignedGetUrl,
  deleteBaseResume,
  getFinalMaterialPresignedGetUrl,
  checkTokenValidation,
};

//final-materials/${userId}/${applicationId}/resume/${randomUUID()}${ext}
//final-materials/${userId}/${applicationId}/cover-letter/${randomUUID()}${ext}

//resumes/${userId}/base-resume/${randomUUID}${ext}
