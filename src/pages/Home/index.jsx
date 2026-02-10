import { lessonService } from '@/services'
import { Fragment, useEffect, useState } from 'react'

export default function Home() {
    const [lessons, setLessons] = useState([])
    const fetchLessons = async () => {
        try {
            const res = await lessonService.getLessons()
            if (res.status === 200) setLessons(res.data)
        } catch (error) {
            setLessons([])
        }
    }

    useEffect(() => {
        fetchLessons()
    }, [])

    return (
        <Fragment>
            <h1 className="text-3xl text-red-500">Home</h1>
            {lessons.length > 0 ? (
                <ul>
                    {lessons.map(lesson => (
                        <li key={lesson.id}>{lesson.title}</li>
                    ))}
                </ul>
            ) : (
                <p>Khong co data...</p>
            )}
        </Fragment>
    )
}
