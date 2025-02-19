import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const PresentationSlide = ({ type, content, bullets, heading, subtext }) => {
    switch (type) {
        case 'title':
            return (
                <div className="flex flex-col items-center justify-center h-full p-8">
                    <h1 className="text-4xl font-bold text-center">{content}</h1>
                    {subtext && (
                        <p className="mt-4 text-xl text-gray-600 text-center">{subtext}</p>
                    )}
                </div>
            );
        case 'section':
            return (
                <div className="flex flex-col h-full p-8">
                    <h2 className="text-2xl font-semibold mb-4">{heading}</h2>
                    <p className="text-lg mb-4">{content}</p>
                    {bullets && bullets.length > 0 && (
                        <ul className="list-disc list-inside space-y-2">
                            {bullets.map((bullet, index) => (
                                <li key={index} className="text-lg">{bullet}</li>
                            ))}
                        </ul>
                    )}
                </div>
            );
        case 'code':
            return (
                <div className="flex flex-col h-full p-8">
                    <h3 className="text-xl font-semibold mb-4">{'title'}</h3>
                    <div className="flex-1 overflow-auto">
                        <SyntaxHighlighter
                            language={'js' || 'javascript'}
                            style={vscDarkPlus}
                            className="rounded-lg"
                            showLineNumbers
                        >
                            {content}
                        </SyntaxHighlighter>
                    </div>
                </div>
            );
        case 'image':
            return (
                <div className="flex flex-col items-center justify-center h-full p-8">
                    <img src={'url'} alt={'caption'} className="max-h-[70vh] object-contain" />
                    <p className="mt-4 text-center text-gray-600">{'caption'}</p>
                </div>
            );
        case 'summary':
            return (
                <div className="flex flex-col h-full p-8">
                    <h2 className="text-2xl font-semibold mb-4">Summary</h2>
                    <p className="text-lg mb-4">{content}</p>
                    {bullets && bullets.length > 0 && (
                        <ul className="list-disc list-inside space-y-2">
                            {bullets.map((bullet, index) => (
                                <li key={index} className="text-lg">{bullet}</li>
                            ))}
                        </ul>
                    )}
                </div>
            );
        default:
            return null;
    }
};

export default PresentationSlide; 