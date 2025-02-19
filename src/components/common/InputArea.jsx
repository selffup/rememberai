import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

const InputArea = ({ message, isLoading, onSubmit, onChange, inputRef }) => {
    return (
        <div className="p-4 bg-white border-t border-gray-200">
            <div className="max-w-3xl mx-auto">
                <form onSubmit={onSubmit} className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={message}
                        onChange={onChange}
                        placeholder="Ask anything about your code..."
                        className="w-full px-4 py-3 pr-12 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-primary-500 disabled:opacity-50"
                        disabled={isLoading}
                    >
                        <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default InputArea; 