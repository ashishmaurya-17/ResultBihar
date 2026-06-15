import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePortalStore } from '../store';

export default function StateHubPage() {
    const { state } = useParams();
    const navigate = useNavigate();
    const [, setStore] = usePortalStore();

    useEffect(() => {
        // Find state name
        const stateName = state ? state.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : 'all';
        setStore({
            selectedState: stateName,
            currentView: 'home',
            selectedCollection: 'all',
            searchKeyword: ''
        });
        navigate('/', { replace: true });
    }, [state, navigate, setStore]);

    return (
        <div className="flex justify-center items-center h-64 text-neutral-500">
            <span className="animate-pulse">Loading state portal...</span>
        </div>
    );
}
