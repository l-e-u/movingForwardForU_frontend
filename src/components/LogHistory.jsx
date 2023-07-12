// component
import CreatedInfo from '../components/CreatedInfo';
import SmallHeader from './SmallHeader';

const LogHistory = ({ logs }) => {
    if (logs.length === 0) return null;
    return (
        <div className='mt-2'>
            <SmallHeader text='Logs' />
            <ul className='list-group mt-1 gap-2'>
                {logs.map((log) => {
                    const date = new Date(log.createdAt);
                    return (
                        <li key={log._id} className='position-relative pt-1 px-2 pb-4 outline'>
                            <small style={{ whiteSpace: 'pre-wrap' }}> {log.note}</small>
                            <CreatedInfo createdAt={log.createdAt} createdBy={log.createdBy} />
                        </li>
                    )
                })}
            </ul>
        </div>
    );
};

export default LogHistory;