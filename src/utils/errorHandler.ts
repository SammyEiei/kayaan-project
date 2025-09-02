/**
 * Error Handler Utility for Frontend
 * จัดการ errors และแสดง user-friendly messages
 */

export const showError = (message: string) => {
  // ใช้ toast library หรือ custom error component
  console.error('User Error:', message);

  // ตัวอย่าง: แสดง toast notification
  // toast.error(message);

  // หรือ: แสดง error state ใน component
  // errorMessage.value = message;
};

export const validateContentData = (contentData: any, contentType: string) => {
  try {
    const parsed = JSON.parse(contentData);

    switch (contentType) {
      case 'note':
        if (!parsed.content || !Array.isArray(parsed.content) || parsed.content.length === 0) {
          throw new Error('Note content must have at least one item');
        }
        // ตรวจสอบว่าแต่ละ item มี feature และ description
        for (const item of parsed.content) {
          if (!item.feature || !item.description) {
            throw new Error('Note content must have feature and description for each item');
          }
        }
        break;

      case 'quiz':
        if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
          throw new Error('Quiz must have at least one question');
        }
        // ตรวจสอบว่าแต่ละ question มี required fields
        for (const question of parsed.questions) {
          if (!question.question || !question.correctAnswer) {
            throw new Error('Quiz questions must have question text and correct answer');
          }
          if (question.type === 'multiple-choice' && (!question.options || question.options.length === 0)) {
            throw new Error('Multiple-choice questions must have options');
          }
        }
        break;

      case 'flashcard':
        if (!parsed.flashcards || !Array.isArray(parsed.flashcards) || parsed.flashcards.length === 0) {
          throw new Error('Flashcard must have at least one card');
        }
        // ตรวจสอบว่าแต่ละ flashcard มี question และ answer
        for (const card of parsed.flashcards) {
          if (!card.question || !card.answer) {
            throw new Error('Flashcards must have question and answer for each card');
          }
        }
        break;

      default:
        throw new Error(`Unknown content type: ${contentType}`);
    }

    return true;
  } catch (error) {
    throw new Error(`Invalid content data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * แสดง user-friendly error message จาก API response
 */
export const getErrorMessage = (error: any): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (error?.response?.data) {
    const errorData = error.response.data;

    // ตรวจสอบ error type จาก Backend
    if (errorData?.errorType === 'ValidationError') {
      return `Content validation failed: ${errorData.details}`;
    } else if (errorData?.errorType === 'ManualGenerationError') {
      return `Manual generation failed: ${errorData.details}`;
    } else if (errorData?.message) {
      return errorData.message;
    }
  }

  if (error?.response?.status === 400) {
    return 'Bad request: Invalid content format';
  } else if (error?.response?.status === 401) {
    return 'Authentication required: Please log in';
  } else if (error?.response?.status === 403) {
    return 'Access denied: You do not have permission';
  } else if (error?.response?.status === 500) {
    return 'Server error: Please try again later';
  }

  return 'An unexpected error occurred';
};
