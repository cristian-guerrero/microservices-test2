import {Router} from 'express';


const router = Router()


router.post('/api/users/signup', (req, res) => {

    res.send('Response')
})

export { router as signUpRoute }