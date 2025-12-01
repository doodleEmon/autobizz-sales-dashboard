import axios from 'axios';
import { AuthToken, SalesResponse, Filters } from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

let authToken: string | null = null;
let tokenExpiry: number | null = null;

const getAuthToken = async (): Promise<string> => {
    if (authToken && tokenExpiry && Date.now() < tokenExpiry) {
        return authToken;
    }

    try {
        const response = await axios.post<AuthToken>(
            `${API_BASE_URL}/getAuthorize`,
            { tokenType: "frontEndTest" },
            { headers: { 'Content-Type': 'application/json' } }
        );

        authToken = response.data.token;
        tokenExpiry = Date.now() + (response.data.expire * 1000) - 60000;

        return authToken;
    } catch (error) {
        console.error('Failed to get auth token:', error);
        throw error;
    }
};

export const fetchSales = async (filters: Filters): Promise<SalesResponse> => {
    try {
        const token = await getAuthToken();

        const params: Record<string, string> = {
            startDate: filters.startDate,
            endDate: filters.endDate,
            priceMin: filters.priceMin || '',
            email: filters.email || '',
            phone: filters.phone || '',
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder,
        };

        if (filters.after) params.after = filters.after;
        if (filters.before) params.before = filters.before;

        const response = await axios.get<SalesResponse>(
            `${API_BASE_URL}/sales`,
            {
                params,
                headers: {
                    'X-AUTOBIZZ-TOKEN': token,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Failed to fetch sales:', error);
        throw error;
    }
};

export const resetPagination = (filters: Filters): Filters => {
    return {
        ...filters,
        after: undefined,
        before: undefined,
    };
};