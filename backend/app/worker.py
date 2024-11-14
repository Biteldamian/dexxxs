from celery import Task
from app.core.celery_app import celery_app
from app.db.session import SessionLocal
from app.services.document_processor import DocumentProcessor
from app.services.training import TrainingService

class DBTask(Task):
    _db = None

    @property
    def db(self):
        if self._db is None:
            self._db = SessionLocal()
        return self._db

    def after_return(self, *args, **kwargs):
        if self._db is not None:
            self._db.close()
            self._db = None

@celery_app.task(base=DBTask, bind=True)
def process_document(self, document_id: str, file_path: str):
    processor = DocumentProcessor(self.db)
    return processor.process_document(document_id, file_path)

@celery_app.task(base=DBTask, bind=True)
def train_model(self, training_session_id: str):
    training_service = TrainingService(self.db)
    return training_service.train(training_session_id)