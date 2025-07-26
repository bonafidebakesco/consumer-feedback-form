import { supabase } from './supabase'
import { QuizSubmission, QuizResponse } from '@/types';

export const submitQuizData = async (formData: Record<string, string | string[] | number>, quizTitle: string, totalPages: number, actualCompletedPages?: number): Promise<QuizResponse> => {
  try {
    // Calculate completion status based on pages, not individual questions
    const answeredQuestions = Object.keys(formData);
    
    // Create a mapping of question names to page numbers based on the actual quiz structure
    // This mapping is based on the quiz data structure from quizData.js
    const questionPageMapping: Record<string, number> = {
      // Page 1: Purchase Info
      'question1': 1,
      
      // Page 2: Future Interest  
      'question2': 2,
      'question3': 2,
      
      // Page 3: About You (Optional)
      'About You': 3,
      'question4': 3,
      
      // Page 4: Product Quality - II
      'question5': 4,
      'question6': 4,
      
      // Page 5: Pricing & Value
      'question7': 5,
      'question8': 5,
      
      // Page 6: Suggestions
      'question10': 6,
      
      // Page 7: Feedback
      'question9': 7,
      
      // Page 8: Product Quality - I
      'question12': 8,
      'question13': 8,
      
      // Page 9: Lucky Draw Entry
      'Please provide your details below to enter our lucky draw.': 9,
      'Phone': 9,
      'question11': 9
    };
    
    // Calculate which pages have been completed
    const completedPageNumbers = new Set<number>();
    
    answeredQuestions.forEach(questionName => {
      const pageNumber = questionPageMapping[questionName];
      if (pageNumber) {
        completedPageNumbers.add(pageNumber);
      }
    });
    
    // Use actual completed pages count if provided, otherwise calculate from questions
    const finalCompletedPages = actualCompletedPages || completedPageNumbers.size;
    const submissionStatus = finalCompletedPages >= totalPages ? 'completed' : 'partial'
    
    // Debug logging
    console.log('Quiz Submission Debug:', {
      totalPages,
      actualCompletedPages,
      calculatedCompletedPages: completedPageNumbers.size,
      finalCompletedPages,
      answeredQuestions,
      completedPageNumbers: Array.from(completedPageNumbers),
      submissionStatus
    });
    
    // Prepare submission data
    const submission: Omit<QuizSubmission, 'id' | 'created_at'> = {
      quiz_title: quizTitle,
      user_responses: formData,
      total_pages: totalPages,
      completed_pages: finalCompletedPages,
      submission_status: submissionStatus,
      metadata: {
        user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
        timestamp: new Date().toISOString(),
        session_id: typeof window !== 'undefined' ? sessionStorage.getItem('quiz_session_id') || undefined : undefined
      }
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('quiz_submissions')
      .insert([submission])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      data: data as QuizSubmission
    }

  } catch (error) {
    console.error('Quiz submission error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

export const getQuizSubmissions = async (): Promise<{ success: boolean; data?: QuizSubmission[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('quiz_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      data: data as QuizSubmission[]
    }

  } catch (error) {
    console.error('Get submissions error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
} 