import React, {Context} from 'react';

export interface BubbleState {
    bubblesEnabled: boolean;
    setBubblesEnabled: (enabled: boolean) => void;
}

const initialState: BubbleState = {
    bubblesEnabled: true,
    setBubblesEnabled: (enabled: boolean) => {
    }
}

const BubbleContext: Context<BubbleState> = React.createContext(initialState);

// @ts-ignore
function BubbleProvider({children}) {
    const [bubblesEnabled, setBubblesEnabled] = React.useState<boolean>(false);

    return (
        <BubbleContext.Provider value={{
            bubblesEnabled: bubblesEnabled,
            setBubblesEnabled: (enabled: boolean) => setBubblesEnabled(enabled)
        }}>
            {children}
        </BubbleContext.Provider>
    );
}

export {BubbleContext, BubbleProvider};
