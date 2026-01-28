'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
  const { locale } = useLanguage();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  if (locale === 'ko') {
    return (
      <div className="min-h-screen px-4 py-6 pb-24">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">뒤로</span>
          </button>

          <h1 className="text-2xl font-bold text-white mb-6">개인정보처리방침</h1>

          <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
            <p className="text-gray-400">시행일: 2025년 1월 28일</p>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">1. 개요</h2>
              <p>
                Mystic Fortune(이하 "앱")은 사용자의 개인정보를 소중히 여기며,
                개인정보보호법 등 관련 법령을 준수합니다. 본 개인정보처리방침은
                앱이 어떤 정보를 수집하고 어떻게 사용하는지 설명합니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">2. 수집하는 정보</h2>
              <p>앱은 운세 서비스 제공을 위해 다음 정보를 수집합니다:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>이름 (닉네임)</li>
                <li>생년월일</li>
                <li>성별</li>
                <li>선호하는 색상, 동물, 음식 (선택사항)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">3. 정보의 저장 및 처리</h2>
              <p>
                <strong>중요:</strong> 입력하신 모든 정보는 사용자의 기기(브라우저)에만
                임시로 저장되며, 서버로 전송되거나 외부에 저장되지 않습니다.
                브라우저의 세션 스토리지를 사용하여 페이지 이동 시에만 데이터를 유지하며,
                브라우저를 닫으면 모든 데이터가 자동으로 삭제됩니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">4. 광고</h2>
              <p>
                앱은 Google AdSense를 통해 광고를 표시할 수 있습니다.
                Google은 광고 제공을 위해 쿠키를 사용할 수 있으며,
                이에 대한 자세한 내용은 Google의 개인정보처리방침을 참조하시기 바랍니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">5. 제3자 제공</h2>
              <p>
                앱은 사용자의 개인정보를 제3자에게 판매, 교환 또는 제공하지 않습니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">6. 아동의 개인정보</h2>
              <p>
                앱은 만 14세 미만 아동의 개인정보를 의도적으로 수집하지 않습니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">7. 개인정보처리방침의 변경</h2>
              <p>
                본 개인정보처리방침은 법령이나 서비스의 변경에 따라 수정될 수 있습니다.
                변경 시 앱 내 공지를 통해 알려드립니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">8. 문의</h2>
              <p>
                개인정보처리방침에 관한 문의사항이 있으시면 아래로 연락해 주시기 바랍니다.
              </p>
              <p className="mt-2 text-indigo-400">
                이메일: mysticfortune.app@gmail.com
              </p>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 pb-24">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>

        <h1 className="text-2xl font-bold text-white mb-6">Privacy Policy</h1>

        <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
          <p className="text-gray-400">Effective Date: January 28, 2025</p>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. Introduction</h2>
            <p>
              Mystic Fortune ("App") values your privacy and complies with applicable
              data protection laws. This Privacy Policy explains what information we
              collect and how we use it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. Information We Collect</h2>
            <p>The App collects the following information to provide fortune-telling services:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Name (nickname)</li>
              <li>Date of birth</li>
              <li>Gender</li>
              <li>Favorite color, animal, food (optional)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. Data Storage and Processing</h2>
            <p>
              <strong>Important:</strong> All information you enter is stored temporarily
              only on your device (browser) and is never transmitted to or stored on
              external servers. We use browser session storage to maintain data during
              page navigation, and all data is automatically deleted when you close
              your browser.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">4. Advertising</h2>
            <p>
              The App may display advertisements through Google AdSense. Google may
              use cookies to serve ads. For more information, please refer to Google's
              Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">5. Third-Party Sharing</h2>
            <p>
              The App does not sell, trade, or otherwise transfer your personal
              information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">6. Children's Privacy</h2>
            <p>
              The App does not intentionally collect personal information from
              children under 14 years of age.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">7. Changes to This Policy</h2>
            <p>
              This Privacy Policy may be updated due to changes in laws or services.
              We will notify you of any changes through the App.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">8. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2 text-indigo-400">
              Email: mysticfortune.app@gmail.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
