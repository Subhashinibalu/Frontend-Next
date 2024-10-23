// pages/settings.js
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function Settings() {
  return (
    <Layout>
      <Head>
        <title>Settings</title>
      </Head>
      <div className="flex items-center justify-center flex-col text-center">
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="mt-4">This is the settings page.</p>
      </div>
    </Layout>
  );
}
