import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { object, string, TypeOf } from 'zod';

import styles from '../../styles/register.module.scss';

const createUserSchema = object({
  name: string().nonempty({
    message: 'Name is required'
  }),
  password: string()
    .nonempty({
      message: 'Password is required'
    })
    .min(6, 'Password too short - should be minimum 6 chars'),
  passwordConfirmation: string().nonempty({
    message: 'passwordConfirmation is required'
  }),
  email: string()
    .nonempty({
      message: 'Email is required'
    })
    .email('Not a valid email')
}).refine((data) => data.password === data.passwordConfirmation, {
  message: 'Passwords do not match',
  path: ['passwordConfirmation']
});

type CreateUserInput = TypeOf<typeof createUserSchema>;

function RegisterPage() {
  const router = useRouter();
  const { registerError, setRegisterError } = useState(null);
  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema)
  });

  async function onSubmit(values: CreateUserInput) {
    const SERVER_ENDPOINT = process.env.NEXT_PUBLIC_SERVER_ENDPOINT;
    console.log(SERVER_ENDPOINT);
    try {
      await axios.post(`${SERVER_ENDPOINT}/api/users`, values);
      // reroute to index if successful
      router.push('/');
    } catch (err) {
      console.log(err);
      setRegisterError(err.message);
    }
  }

  return (
    <>
      <p>{registerError}</p>
      <form
        className={styles.registrationForm}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={styles.formElement}>
          <label htmlFor="email">email</label>
          <input
            id="email"
            type="email"
            placeholder="name@email.com"
            {...register('email')}
          />
          <p>{errors.email?.message}</p>
        </div>

        <div className={styles.formElement}>
          <label htmlFor="name">name</label>
          <input
            id="name"
            type="text"
            placeholder="Name Surname"
            {...register('name')}
          />
          <p>{errors.name?.message}</p>
        </div>

        <div className={styles.formElement}>
          <label htmlFor="password">password</label>
          <input
            id="password"
            type="password"
            placeholder="******"
            {...register('password')}
          />
          <p>{errors.password?.message}</p>
        </div>

        <div className={styles.formElement}>
          <label htmlFor="passwordConfirmation">passwordConfirmation</label>
          <input
            id="passwordConfirmation"
            type="password"
            placeholder="******"
            {...register('passwordConfirmation')}
          />
          <p>{errors.passwordConfirmation?.message}</p>
        </div>
        <button type="submit">SUBMIT</button>
      </form>
    </>
  );
}

export default RegisterPage;
