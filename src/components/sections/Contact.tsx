'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  contactSchema,
  defaultContactValues,
  inquiryTypeLabels,
  inquiryTypes,
  isValidFormspreeEndpoint,
  mapFormspreeError,
  type ContactFormData,
  type SubmitStatus,
} from '@/lib/contact-form';
import styles from './Contact.module.scss';

export function Contact() {
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formEndpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
  const hasEndpoint = Boolean(formEndpoint);
  const hasValidEndpoint = formEndpoint
    ? isValidFormspreeEndpoint(formEndpoint)
    : false;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: defaultContactValues,
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitError(null);
    setSubmitStatus('idle');

    if (!formEndpoint || !isValidFormspreeEndpoint(formEndpoint)) {
      setSubmitStatus('error');
      setSubmitError(
        'Envio real indisponível: configure um endpoint válido do Formspree '
          + 'em NEXT_PUBLIC_FORMSPREE_ENDPOINT.',
      );
      return;
    }

    try {
      const response = await fetch(formEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          ...data,
          source: 'nextforge-template',
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const fallbackError = 'Não foi possível enviar agora. Tente novamente em instantes.';
        const remoteError = payload?.errors?.[0]?.message;
        throw new Error(mapFormspreeError(remoteError ?? fallbackError));
      }

      setSubmitStatus('success');
      reset(defaultContactValues);
    } catch (error) {
      setSubmitStatus('error');
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Não foi possível enviar agora. '
            + 'Verifique a configuração do Formspree e tente novamente.',
      );
    }
  };

  return (
    <section id='contact' className={styles.contact} aria-label='Formulário de contato'>
      <div className={styles.container}>
        <h2 className={styles.title}>Contato sobre o template</h2>
        <p className={styles.subtitle}>
          Este boilerplate é o foco principal. Se quiser apoio para adaptar ou
          desenvolver um site sob medida, use o formulário abaixo.
        </p>

        {!hasEndpoint && (
          <div className={styles.configMessage} role='status'>
            Modo demo: configure NEXT_PUBLIC_FORMSPREE_ENDPOINT para ativar envio real.
          </div>
        )}

        {hasEndpoint && !hasValidEndpoint && (
          <div className={styles.errorMessage} role='alert'>
            Endpoint configurado em formato inválido. Use o endpoint do painel do Formspree,
            por exemplo: https://formspree.io/f/xxxxabcd.
          </div>
        )}

        {submitStatus === 'success' && (
          <div className={styles.successMessage} role='alert'>
            Mensagem enviada. Obrigado pelo contato! Se for sobre customização,
            retorno com os próximos passos.
          </div>
        )}

        {submitStatus === 'error' && submitError && (
          <div className={styles.errorMessage} role='alert'>
            {submitError}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor='name' className={styles.label}>
                Nome <span aria-hidden='true'>*</span>
              </label>
              <input
                id='name'
                type='text'
                className={styles.input}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                {...register('name')}
              />
              {errors.name && (
                <span id='name-error' className={styles.error} role='alert'>
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor='email' className={styles.label}>
                E-mail <span aria-hidden='true'>*</span>
              </label>
              <input
                id='email'
                type='email'
                className={styles.input}
                placeholder='voce@empresa.com'
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                {...register('email')}
              />
              {errors.email && (
                <span id='email-error' className={styles.error} role='alert'>
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor='phone' className={styles.label}>
              Telefone <span className={styles.optional}>(opcional)</span>
            </label>
            <input
              id='phone'
              type='tel'
              className={styles.input}
              {...register('phone')}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor='inquiryType' className={styles.label}>
              Tipo de solicitação <span aria-hidden='true'>*</span>
            </label>
            <select
              id='inquiryType'
              className={styles.input}
              aria-invalid={!!errors.inquiryType}
              aria-describedby={errors.inquiryType ? 'inquiry-type-error' : undefined}
              {...register('inquiryType')}
            >
              {inquiryTypes.map((inquiryType) => (
                <option key={inquiryType} value={inquiryType}>
                  {inquiryTypeLabels[inquiryType]}
                </option>
              ))}
            </select>
            {errors.inquiryType && (
              <span id='inquiry-type-error' className={styles.error} role='alert'>
                Selecione um tipo de solicitação.
              </span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor='message' className={styles.label}>
              Mensagem <span aria-hidden='true'>*</span>
            </label>
            <textarea
              id='message'
              rows={5}
              className={styles.textarea}
              placeholder='Conte seu contexto, prazo e o que deseja adaptar no template.'
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
              {...register('message')}
            />
            {errors.message && (
              <span id='message-error' className={styles.error} role='alert'>
                {errors.message.message}
              </span>
            )}
          </div>

          <button
            type='submit'
            className={styles.submit}
            disabled={isSubmitting || !hasValidEndpoint}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
          </button>
        </form>
      </div>
    </section>
  );
}
