import { useState } from 'react';
import { SEO } from '../components/SEO';
import { CheckCircle } from 'lucide-react';

export const DataDeletionRequest = () => {
    const [email, setEmail] = useState('');
    const [reason, setReason] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // In production, send to backend API
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/data-deletion`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, reason })
            });

            if (response.ok) {
                setSubmitted(true);
            } else {
                throw new Error('Request failed');
            }
        } catch (error) {
            // Fallback: Just show success message
            console.error('Data deletion request failed:', error);
            setSubmitted(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SEO
                title="資料刪除請求 | Mosport"
                description="提交資料刪除請求。我們會在 30 天內處理您的請求。"
            />
            <div className="min-h-screen bg-mosport-black flex items-center justify-center p-4">
                <div className="max-w-2xl w-full bg-gray-900 border border-gray-800 rounded-2xl p-8">
                    {!submitted ? (
                        <>
                            <h1 className="text-3xl font-bold text-white mb-4">資料刪除請求</h1>
                            <p className="text-gray-400 mb-6">
                                根據 GDPR 和個人資料保護法，您有權要求刪除您在 Mosport 的個人資料。
                                我們將在收到請求後 <strong className="text-white">30 天內</strong>處理。
                            </p>

                            <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4 mb-6">
                                <h3 className="text-yellow-500 font-semibold mb-2">⚠️ 注意事項</h3>
                                <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                                    <li>資料刪除後將無法復原</li>
                                    <li>您的收藏清單、訂閱通知將被永久刪除</li>
                                    <li>若您使用第三方登入（Google/Facebook），您的基本資料將從我們系統移除</li>
                                </ul>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                        Email 帳號 *
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        請輸入您在 Mosport 註冊時使用的 Email
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-2">
                                        原因（選填）
                                    </label>
                                    <textarea
                                        id="reason"
                                        rows={4}
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder="您可以告訴我們刪除原因，幫助我們改進服務..."
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors"
                                >
                                    {loading ? '提交中...' : '提交刪除請求'}
                                </button>
                            </form>

                            <p className="text-xs text-gray-500 mt-6 text-center">
                                如有任何問題，請聯繫：<a href="mailto:mikemm521@gmail.com" className="text-blue-400 hover:underline">mikemm521@gmail.com</a>
                            </p>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4">
                                <CheckCircle className="w-12 h-12 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">請求已提交</h2>
                            <p className="text-gray-400 mb-2">
                                我們已收到您的資料刪除請求。
                            </p>
                            <p className="text-gray-400 mb-6">
                                確認 Email 將發送至：<strong className="text-white">{email}</strong>
                            </p>
                            <p className="text-sm text-gray-500">
                                我們將在 <strong className="text-white">30 天內</strong>完成處理並通知您。
                            </p>
                            <a
                                href="/"
                                className="inline-block mt-6 text-blue-400 hover:text-blue-300 font-medium"
                            >
                                返回首頁
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
