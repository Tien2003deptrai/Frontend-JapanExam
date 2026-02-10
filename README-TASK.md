index.js (services)
export {default as UserService} from './user/user.service'
export {default as PlayerService} from './player/player.service'
export {default as FosService} from './field_of_study/field_of_study.service'
export {default as VideoService} from './video/video.service'
export {default as FriendService} from './friend/friend.service'

// Provider
import \* as Services from '@/services'

    const service_instances = {} as AxiosContextType;
    const class_names = Object.keys(Services) as Array<keyof typeof Services>
    class_names.forEach(class_name => {
        const Class = Services[class_name] as unknown as ClassType
        service_instances[class_name] = handleError(Class)
    })

export function useAPI() {
return useContext(AxiosContext)
}

//
const { CourseService } = useAPI()
