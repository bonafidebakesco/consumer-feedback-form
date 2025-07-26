'use client';

import {useState} from 'react';
import {json} from '@/data/quizData';
import {submitQuizData} from '@/lib/quizService';
import {validateName, validateEmail, validateIndianPhone, formatIndianPhone} from '@/lib/validation';
import {FormData} from '@/types';


export default function QuizPage() {
    const [currentPage, setCurrentPage] = useState(0);

    const [formData, setFormData] = useState<FormData>({});
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [validationSuccess, setValidationSuccess] = useState<Record<string, boolean>>({});
    const [completedPages, setCompletedPages] = useState<Set<number>>(new Set());

    const totalPages = json.pages.length;
    const progress = ((currentPage + 1) / totalPages) * 100;

    // Function to check if a page has required fields and if they're completed
  const getPageStatus = (pageIndex: number) => {
    const page = json.pages[pageIndex];
    if (!page || !page.elements) return 'future';

    // const hasRequiredFields = page.elements.some((element: any) => element.isRequired);
    const requiredFields = page.elements.filter((element: any) => element.isRequired); // eslint-disable-line @typescript-eslint/no-explicit-any

    const completedRequiredFields = requiredFields.filter((element: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const value = formData[element.name];
      
      // Handle opt-out case for the final page
      if (pageIndex === totalPages - 1) {
        const hasOptedOut = Array.isArray(formData.opt_out) && formData.opt_out.includes('opt_out');
        if (hasOptedOut && ['name', 'email', 'phone'].includes(element.name)) {
          return true; // Consider these fields as completed if opted out
        }
      }
      
      if (element.type === 'checkbox') {
        return Array.isArray(value) && value.length > 0;
      } else if (element.type === 'rating') {
        return value !== undefined && value !== '';
      } else {
        return typeof value === 'string' && value.trim() !== '';
      }
    });

    const hasAnyAnswer = page.elements.some((element: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const value = formData[element.name];
      return Array.isArray(value) ? value.length > 0 : value !== undefined && value !== '';
    });

    if (requiredFields.length === 0) {
      return hasAnyAnswer ? 'completed' : undefined; // don't mark as completed unless answered
    }

    if (completedRequiredFields.length === requiredFields.length) {
      return 'completed';
    } else if (hasAnyAnswer && pageIndex < currentPage) {
      return 'skipped';
    } else {
      return undefined; // neutral/default state
    }
  };
    const handleAnswer = (questionName: string, value: string | string[] | number) => {
        setFormData(prev => ({
            ...prev,
            [questionName]: value
        }));

        // Clear validation errors when user starts typing
        if (validationErrors[questionName]) {
            setValidationErrors(prev => {
                const newErrors = {...prev};
                delete newErrors[questionName];
                return newErrors;
            });
        }
    };

    const validateField = (fieldName: string, value: string | string[] | number) => {
        let validationResult;

        // Only validate string fields
        if (typeof value !== 'string') return;

        switch (fieldName.toLowerCase()) {
            case 'name':
                validationResult = validateName(value);
                break;
            case 'email':
                validationResult = validateEmail(value);
                break;
            case 'phone':
                validationResult = validateIndianPhone(value);
                break;
            default:
                return;
        }

        if (validationResult.isValid) {
            setValidationErrors(prev => {
                const newErrors = {...prev};
                delete newErrors[fieldName];
                return newErrors;
            });
            setValidationSuccess(prev => ({
                ...prev,
                [fieldName]: true
            }));
        } else {
            setValidationErrors(prev => ({
                ...prev,
                [fieldName]: validationResult.error!
            }));
            setValidationSuccess(prev => ({
                ...prev,
                [fieldName]: false
            }));
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages - 1) {
            // Check if current page has required fields that are not completed
            const currentPageData = json.pages[currentPage];
            const requiredFields = currentPageData.elements?.filter((element: any) => element.isRequired) || []; // eslint-disable-line @typescript-eslint/no-explicit-any

            // Validate all required fields
            let hasValidationErrors = false;
            const newValidationErrors: Record<string, string> = {};

            requiredFields.forEach((element: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                const value = formData[element.name];

                // Skip validation for personal details if user has opted out
                if (currentPage === totalPages - 1) {
                    const hasOptedOut = Array.isArray(formData.opt_out) && formData.opt_out.includes('opt_out');
                    if (hasOptedOut && ['name', 'email', 'phone'].includes(element.name)) {
                        return; // Skip validation for these fields if opted out
                    }
                }

                if (element.type === 'text') {
                    // Validate text fields
                    if (element.name.toLowerCase().includes('name')) {
                        const result = validateName(typeof value === 'string' ? value : '');
                        if (!result.isValid) {
                            newValidationErrors[element.name] = result.error!;
                            hasValidationErrors = true;
                        }
                    } else if (element.name.toLowerCase().includes('email')) {
                        const result = validateEmail(typeof value === 'string' ? value : '');
                        if (!result.isValid) {
                            newValidationErrors[element.name] = result.error!;
                            hasValidationErrors = true;
                        }
                    } else if (element.name.toLowerCase().includes('phone')) {
                        const result = validateIndianPhone(typeof value === 'string' ? value : '');
                        if (!result.isValid) {
                            newValidationErrors[element.name] = result.error!;
                            hasValidationErrors = true;
                        }
                    } else {
                        // Generic text validation
                        if (!value || (typeof value === 'string' && value.trim() === '')) {
                            newValidationErrors[element.name] = 'This field is required';
                            hasValidationErrors = true;
                        }
                    }
                } else if (element.type === 'checkbox') {
                    if (!value || (Array.isArray(value) && value.length === 0)) {
                        newValidationErrors[element.name] = 'Please select at least one option';
                        hasValidationErrors = true;
                    }
                } else if (element.type === 'rating') {
                    if (value === undefined || value === '') {
                        newValidationErrors[element.name] = 'Please provide a rating';
                        hasValidationErrors = true;
                    }
                }
            });

            // Update validation errors
            if (hasValidationErrors) {
                setValidationErrors(prev => ({...prev, ...newValidationErrors}));
                alert('Please fix the validation errors before proceeding.');
                return;
            }

            // Check if all required fields are completed
            const allRequiredCompleted = requiredFields.every((element: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                const value = formData[element.name];
                
                // Skip validation for personal details if user has opted out
                if (currentPage === totalPages - 1) {
                    const hasOptedOut = Array.isArray(formData.opt_out) && formData.opt_out.includes('opt_out');
                    if (hasOptedOut && ['name', 'email', 'phone'].includes(element.name)) {
                        return true; // Consider these fields as completed if opted out
                    }
                }
                
                if (element.type === 'checkbox') {
                    return Array.isArray(value) && value.length > 0;
                } else if (element.type === 'rating') {
                    return value !== undefined && value !== '';
                } else {
                    return typeof value === 'string' && value.trim() !== '';
                }
            });

            if (requiredFields.length === 0 || allRequiredCompleted) {
                // Mark current page as completed
                setCompletedPages(prev => new Set([...prev, currentPage + 1]));
                setCurrentPage(currentPage + 1);
            } else {
                alert('Please complete all required fields before proceeding.');
            }
        }
    };

    const handlePrevious = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            // Mark the current page as completed if user submits from it
            const finalCompletedPages = new Set([...completedPages, currentPage + 1]);

            const result = await submitQuizData(
                formData as Record<string, string | string[] | number>,
                json.title,
                totalPages,
                finalCompletedPages.size
            );

            if (result.success) {
                alert('Thank you for your feedback! Your responses have been saved successfully.');
                // Optionally reset the form or redirect
                setFormData({});
                setCurrentPage(0);
            } else {
                alert(`Error submitting feedback: ${result.error}. Please try again.`);
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderElement = (element: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        switch (element.type) {
            case 'checkbox':
                // Check if this is the opt-out checkbox on the contact page
                const isOptOutCheckbox = element.name === 'opt_out' && currentPage === totalPages - 1;
                
                if (isOptOutCheckbox) {
                    return (
                        <div key={element.name} className={`opt-out-checkbox ${
                            Array.isArray(formData[element.name]) && (formData[element.name] as string[]).includes('opt_out') ? 'selected' : ''
                        }`}>
                            <svg className="privacy-icon" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            {element.choices?.map((choice: any, index: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                                <div
                                    key={index}
                                    className={`checkbox-option ${
                                        Array.isArray(formData[element.name]) && (formData[element.name] as string[]).includes(choice.value) ? 'selected' : ''
                                    }`}
                                    onClick={() => {
                                        let currentValues: string[] = [];
                                        const value = formData[element.name];
                                        if (Array.isArray(value)) {
                                            currentValues = value;
                                        } else if (typeof value === 'string' && value.length > 0) {
                                            currentValues = [value];
                                        }
                                        let newValues;
                                        if (currentValues.includes(choice.value)) {
                                            newValues = currentValues.filter((v) => v !== choice.value);
                                        } else {
                                            newValues = [...currentValues, choice.value];
                                        }
                                        handleAnswer(element.name, newValues);
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={Array.isArray(formData[element.name]) && (formData[element.name] as string[]).includes(choice.value) || false}
                                        readOnly
                                        className="mr-3"
                                    />
                                    <span className="text-sm font-medium">{choice.text}</span>
                                </div>
                            ))}
                        </div>
                    );
                } else {
                    return (
                        <div key={element.name} className="mb-8">
                            <h3 className="text-2xl font-bold mb-8 text-[#254569] leading-relaxed border-b-2 border-amber-200 pb-4 relative">
                                <div className="text-[#254569] font-bold">
                                    {element.title}
                                </div>
                            </h3>
                            <div className="checkbox-grid">
                                                             {element.choices?.map((choice: any, index: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                                <div
                                    key={index}
                                    className={`checkbox-option ${
                                        Array.isArray(formData[element.name]) && (formData[element.name] as string[]).includes(choice.value) ? 'selected' : ''
                                    }`}
                                    onClick={() => {
                                        let currentValues: string[] = [];
                                        const value = formData[element.name];
                                        if (Array.isArray(value)) {
                                            currentValues = value;
                                        } else if (typeof value === 'string' && value.length > 0) {
                                            currentValues = [value];
                                        }
                                        let newValues;
                                        if (currentValues.includes(choice.value)) {
                                            newValues = currentValues.filter((v) => v !== choice.value);
                                        } else {
                                            newValues = [...currentValues, choice.value];
                                        }
                                        handleAnswer(element.name, newValues);
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={Array.isArray(formData[element.name]) && (formData[element.name] as string[]).includes(choice.value) || false}
                                        readOnly
                                        className="mr-3"
                                    />
                                    <span className="text-sm font-medium">{choice.text}</span>
                                </div>
                            ))}
                                {element.showSelectAllItem && (
                                    <div
                                        className={`checkbox-option select-all ${
                                            Array.isArray(formData[element.name]) && (formData[element.name] as string[]).length === element.choices?.length ? 'selected' : ''
                                        }`}
                                        onClick={() => {
                                            const allValues = element.choices?.map((c: any) => c.value) || []; // eslint-disable-line @typescript-eslint/no-explicit-any
                                            handleAnswer(element.name, allValues);
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={Array.isArray(formData[element.name]) && (formData[element.name] as string[]).includes('none')}
                                            readOnly
                                            className="mr-3"
                                        />
                                        <span className="font-semibold">{element.selectAllText}</span>
                                    </div>
                                )}
                                <div
                                    className="checkbox-option clear"
                                    onClick={() => {
                                        handleAnswer(element.name, []);
                                    }}
                                >
                                    <span className="font-medium text-red-600">Clear All</span>
                                </div>
                            </div>
                            {element.showNoneItem && (
                                <div className="mt-4">
                                    <div
                                        className={`checkbox-option ${
                                            Array.isArray(formData[element.name]) && (formData[element.name] as string[]).includes('none') ? 'selected' : ''
                                        }`}
                                        onClick={() => {
                                            handleAnswer(element.name, ['none']);
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={Array.isArray(formData[element.name]) && (formData[element.name] as string[]).includes('none')}
                                            readOnly
                                            className="mr-3"
                                        />
                                        <span className="font-medium">{element.noneText}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                }

            case 'rating':
                return (
                    <div key={element.name} className="mb-8">
                        <h3 className="text-xl font-bold mb-6 text-[#254569] leading-relaxed border-b-2 border-amber-200 pb-3 relative">
                            <div className="text-[#254569] font-bold">
                                {element.title}
                            </div>
                        </h3>
                        <div className="flex gap-6 justify-center">
                            {element.rateValues?.map((rate: any, index: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                                <div
                                    key={index}
                                    className={`rating-option ${
                                        formData[element.name] === rate.value ? 'selected' : ''
                                    }`}
                                    onClick={() => handleAnswer(element.name, rate.value)}
                                >
                                    <input
                                        type="radio"
                                        name={element.name}
                                        value={rate.value}
                                        checked={formData[element.name] === rate.value}
                                        readOnly
                                        className="mr-3"
                                    />
                                    <span className="text-sm font-medium">{rate.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'dropdown':
                return (
                    <div key={element.name} className="mb-8">
                        <h3 className="text-xl font-bold mb-6 text-[#254569] leading-relaxed border-b-2 border-amber-200 pb-3 relative">
                            <div className="text-[#254569] font-bold">
                                {element.title}
                            </div>
                        </h3>
                        <select
                            className="dropdown-field"
                            value={formData[element.name] || ''}
                            onChange={(e) => handleAnswer(element.name, e.target.value)}
                        >
                            <option value="">{element.placeholder}</option>
                            {element.choices?.map((choice: string, index: number) => (
                                <option key={index} value={choice}>
                                    {choice}
                                </option>
                            ))}
                        </select>
                    </div>
                );

          case 'tagbox':
            const singleSelectQuestions = [
              'question2',
              'question3',
              'question5',
              'question6',
              'question7',
              'question8',
              'question12',
              'question13',
            ];

            const isSingleSelect = singleSelectQuestions.includes(element.name);
            const currentValue = formData[element.name];

            return (
                <div key={element.name} className="mb-8">
                  <h3 className="text-2xl font-bold mb-8 text-[#254569] leading-relaxed border-b-2 border-amber-200 pb-4 relative">
                    <div className="text-[#254569] font-bold">
                      {element.title}
                    </div>
                  </h3>

                  <div
                      className={`tag-container ${
                          isSingleSelect ? 'flex gap-6 justify-center' : ''
                      }`}
                  >
                    {element.choices?.map((choice: any, index: number) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                      const isSelected = isSingleSelect
                          ? currentValue === choice.value
                          : Array.isArray(currentValue) && currentValue.includes(choice.value);

                      return (
                          <div
                              key={index}
                              className={`tag ${isSelected ? 'selected' : ''}`}
                              onClick={() => {
                                if (isSingleSelect) {
                                  handleAnswer(element.name, choice.value);
                                } else {
                                  const currentValues = Array.isArray(currentValue)
                                      ? currentValue
                                      : [];
                                  const newValues = currentValues.includes(choice.value)
                                      ? currentValues.filter((v: string) => v !== choice.value)
                                      : [...currentValues, choice.value];
                                  handleAnswer(element.name, newValues);
                                }
                              }}
                          >
                            {choice.text}
                          </div>
                      );
                    })}
                  </div>
                </div>
            );

            case 'text':
                // Check if this is the final page (contact info page)
                const isContactPage = currentPage === totalPages - 1;
                
                if (isContactPage) {
                    // Check if user has opted out of providing personal details
                    const hasOptedOut = Array.isArray(formData.opt_out) && formData.opt_out.includes('opt_out');
                    
                    // Hide personal details fields if user has opted out
                    if (hasOptedOut && ['name', 'email', 'phone'].includes(element.name)) {
                        return null;
                    }

                    const getFieldIcon = (fieldName: string) => {
                        switch (fieldName.toLowerCase()) {
                            case 'name':
                                return (
                                    <svg className="contact-field-icon" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                );
                            case 'email':
                                return (
                                    <svg className="contact-field-icon" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                );
                            case 'phone':
                                return (
                                    <svg className="contact-field-icon" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                );
                            default:
                                return null;
                        }
                    };

                    return (
                        <div key={element.name} className="contact-field">
                            <label htmlFor={element.name}>
                                {element.title}
                            </label>
                            <input
                                id={element.name}
                                type={element.inputType || 'text'}
                                className={`contact-input ${
                                    validationErrors[element.name] ? 'error' :
                                        validationSuccess[element.name] ? 'success' : ''
                                }`}
                                value={formData[element.name] || ''}
                                onChange={(e) => {
                                    let value = e.target.value;

                                    // Auto-format phone numbers
                                    if (element.name.toLowerCase().includes('phone')) {
                                        value = formatIndianPhone(value);
                                    }

                                    handleAnswer(element.name, value);
                                }}
                                onBlur={(e) => {
                                    // Validate on blur for better UX
                                    if (element.name.toLowerCase().includes('name') ||
                                        element.name.toLowerCase().includes('email') ||
                                        element.name.toLowerCase().includes('phone')) {
                                        validateField(element.name, e.target.value);
                                    }
                                }}
                                placeholder={element.placeholder}
                            />
                            {getFieldIcon(element.name)}
                            {validationErrors[element.name] && (
                                <div className="contact-validation-message error">
                                    {validationErrors[element.name]}
                                </div>
                            )}
                            {validationSuccess[element.name] && !validationErrors[element.name] && (
                                <div className="contact-validation-message success">
                                    {element.name.toLowerCase().includes('name') ? 'Valid name' :
                                        element.name.toLowerCase().includes('email') ? 'Valid email' :
                                            element.name.toLowerCase().includes('phone') ? 'Valid phone number' : 'Valid input'}
                                </div>
                            )}
                        </div>
                    );
                } else {
                    return (
                        <div key={element.name} className="mb-8">
                            <h3 className="text-xl font-bold mb-6 text-[#254569] leading-relaxed border-b-2 border-amber-200 pb-3 relative">
                                <div className="text-[#254569] font-bold">
                                    {element.title}
                                </div>
                            </h3>
                            <input
                                type={element.inputType || 'text'}
                                className={`input-field ${
                                    validationErrors[element.name] ? 'error' :
                                        validationSuccess[element.name] ? 'success' : ''
                                }`}
                                value={formData[element.name] || ''}
                                onChange={(e) => {
                                    let value = e.target.value;

                                    // Auto-format phone numbers
                                    if (element.name.toLowerCase().includes('phone')) {
                                        value = formatIndianPhone(value);
                                    }

                                    handleAnswer(element.name, value);
                                }}
                                onBlur={(e) => {
                                    // Validate on blur for better UX
                                    if (element.name.toLowerCase().includes('name') ||
                                        element.name.toLowerCase().includes('email') ||
                                        element.name.toLowerCase().includes('phone')) {
                                        validateField(element.name, e.target.value);
                                    }
                                }}
                                placeholder={element.placeholder}
                            />
                            {validationErrors[element.name] && (
                                <div className="error-message">
                                    {validationErrors[element.name]}
                                </div>
                            )}
                            {validationSuccess[element.name] && !validationErrors[element.name] && (
                                <div className="success-message">
                                    {element.name.toLowerCase().includes('name') ? 'Valid name' :
                                        element.name.toLowerCase().includes('email') ? 'Valid email' :
                                            element.name.toLowerCase().includes('phone') ? 'Valid phone number' : 'Valid input'}
                                </div>
                            )}
                        </div>
                    );
                }

            case 'comment':
                return (
                    <div key={element.name} className="mb-8">
                        <h3 className="text-xl font-bold mb-6 text-[#254569] leading-relaxed border-b-2 border-amber-200 pb-3 relative">
                            <div className="text-[#254569] font-bold">
                                {element.title}
                            </div>
                        </h3>
                        <textarea
                            className="textarea-field"
                            value={formData[element.name] || ''}
                            onChange={(e) => handleAnswer(element.name, e.target.value)}
                            placeholder="Share your thoughts..."
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    const currentPageData = json.pages[currentPage];

    return (
        <div className="min-h-screen py-4">
            <div className="quiz-container">
                <div className="text-center mb-8 ">
                    <div className="flex justify-between items-center mb-6 ">
                        <div></div>
                        <h1 className="text-3xl font-bold text-[#254569] tracking-tight p-20" style={{fontSize: '2rem !important',paddingBottom:"2rem", lineHeight: '1.2 !important',fontWeight:'bolder', color: '#254569 !important'}}>
                            {json.title}
                        </h1>
                        <a
                            href="/analytics"
                            className="text-xl font-semibold text-[#254569] hover:text-[#C1A06E] transition-colors duration-200 px-4 py-3 rounded-lg hover:bg-amber-50"
                            style={{fontSize: '1.1rem !important', fontWeight: '600 !important'}}
                        >
                            View Analytics →
                        </a>
                    </div>
                </div>

                <div className="progress-bar">
                    <div
                        className="progress-fill m-10"
                        style={{width: `${progress}%`}}
                    ></div>
                    {Array.from({length: totalPages}, (_, index) => {
                        const status = getPageStatus(index);
                        const isCurrentPage = index === currentPage;

                        return (
                            <div
                                key={index}
                                className={`progress-stop ${status} ${isCurrentPage ? 'current' : ''}`}
                                style={{left: `${((index + 0.5) / totalPages) * 100}%`}}
                                onClick={() => {
                                    // Allow navigation to completed pages, current page, or pages with data
                                    if (index <= currentPage || Object.keys(formData).length > 0) {
                                        setCurrentPage(index);
                                    }
                                }}
                                title={`Page ${index + 1}${
                                    status === 'completed' ? ' (Completed)' :
                                        status === 'skipped' ? ' (Required fields skipped)' :
                                            isCurrentPage ? ' (Current)' : ' (Not started)'
                                }`}
                            />
                        );
                    })}
                </div>

                {currentPage === totalPages - 1 ? (
                    <div className="contact-form">
                        <div className="contact-form-header">
                            <h2>{currentPageData.title}</h2>
                            {currentPageData.description && (
                                <p>{currentPageData.description}</p>
                            )}
                        </div>

                        <div>
                            {currentPageData.elements?.map((element: any) => renderElement(element))} {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
                        </div>

                        <div className="contact-form-footer">
                            <div className="privacy-note">
                                <strong>Privacy Notice:</strong> Your information will be kept confidential and used only for the lucky draw. We respect your privacy and will not share your details with third parties.
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="question-card">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-[#254569] mb-4 tracking-tight">
                                {currentPageData.title}
                            </h2>
                            {currentPageData.description && (
                                <p className="text-lg text-[#4a4a4a] leading-relaxed bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200/50 shadow-sm max-w-2xl mx-auto">
                                    {currentPageData.description}
                                </p>
                            )}
                        </div>

                        <div className="space-y-8">
                            {currentPageData.elements?.map((element: any) => renderElement(element))} {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center mt-8">
                    <button
                        onClick={handlePrevious}
                        disabled={currentPage === 0}
                        className={`btn-secondary ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Previous
                    </button>

                    {currentPage === totalPages - 1 ? (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className={`btn-submit-contact ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Submitting...' : 
                                (Array.isArray(formData.opt_out) && formData.opt_out.includes('opt_out')) 
                                    ? 'Submit Anonymously' 
                                    : 'Submit Feedback'}
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="btn-primary"
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
