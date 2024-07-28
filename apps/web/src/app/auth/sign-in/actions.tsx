'use server'

import { signInWithPassword } from '@/http/sign-in-with-password'

export async function signInWithEmailAndPassword(
  previeousState: unknown,
  data: FormData,
) {
  console.log('previeousState', previeousState)

  const { email, password } = Object.fromEntries(data)

  await new Promise((resolve) => setTimeout(resolve, 2000))

  const result = signInWithPassword({
    email: String(email),
    password: String(password),
  })

  console.log(result)

  return 'Success'
}
