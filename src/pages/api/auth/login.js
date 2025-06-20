export default async function handler(req, res) {
  try {
    const { email, password } = req.body
    res.status(200).json({ message: 'Login complete!' });
  } catch (error) {
    if (error.type === 'CredentialsSignin') {
      res.status(401).json({ error: 'Invalid credentials.' })
    } else {
      res.status(500).json({ error: 'Something went wrong.' })
    }
  }
}