import {Router} from 'express';


const router = Router()


router.post('/api/users/signin', (req, res) => {

    // create new code

    res.send('Response')
})

export { router as signInRoute }