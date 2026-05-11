// Load simulation data based on the type parameter
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
    return {
        simulationType: params.type
    };
}