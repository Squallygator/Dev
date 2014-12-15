using System.Windows.Forms;

namespace MySQLRunner
{
    partial class Form1
    {
        /// <summary>
        /// Variable nécessaire au concepteur.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Nettoyage des ressources utilisées.
        /// </summary>
        /// <param name="disposing">true si les ressources managées doivent être supprimées ; sinon, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Code généré par le Concepteur Windows Form

        /// <summary>
        /// Méthode requise pour la prise en charge du concepteur - ne modifiez pas
        /// le contenu de cette méthode avec l'éditeur de code.
        /// </summary>
        private void InitializeComponent()
        {
            this.ClbListeFichiers = new System.Windows.Forms.CheckedListBox();
            this.txtSqlFileDirectory = new System.Windows.Forms.TextBox();
            this.button1 = new System.Windows.Forms.Button();
            this.lblSqlFileDirectory = new System.Windows.Forms.Label();
            this.ClbListeConnection = new System.Windows.Forms.CheckedListBox();
            this.btnCheckAll = new System.Windows.Forms.Button();
            this.btnDirectoryParser = new System.Windows.Forms.Button();
            this.btnCheckNone = new System.Windows.Forms.Button();
            this.btnCheckAll2 = new System.Windows.Forms.Button();
            this.btnCheckNone2 = new System.Windows.Forms.Button();
            this.btnExec = new System.Windows.Forms.Button();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.btnCheckConnections = new System.Windows.Forms.Button();
            this.btnShowFiles = new System.Windows.Forms.Button();
            this.cbbFilterConnectionPlateforme = new System.Windows.Forms.ComboBox();
            this.btnFilterConnection = new System.Windows.Forms.Button();
            this.cbbFilterConnectionPays = new System.Windows.Forms.ComboBox();
            this.txtFileFilter = new System.Windows.Forms.TextBox();
            this.btnFileFilter = new System.Windows.Forms.Button();
            this.txtSortie = new System.Windows.Forms.TextBox();
            this.txtVersion = new System.Windows.Forms.TextBox();
            this.label4 = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // ClbListeFichiers
            // 
            this.ClbListeFichiers.CheckOnClick = true;
            this.ClbListeFichiers.FormattingEnabled = true;
            this.ClbListeFichiers.HorizontalScrollbar = true;
            this.ClbListeFichiers.Location = new System.Drawing.Point(6, 88);
            this.ClbListeFichiers.Name = "ClbListeFichiers";
            this.ClbListeFichiers.Size = new System.Drawing.Size(640, 184);
            this.ClbListeFichiers.TabIndex = 0;
            // 
            // txtSqlFileDirectory
            // 
            this.txtSqlFileDirectory.Location = new System.Drawing.Point(6, 23);
            this.txtSqlFileDirectory.Name = "txtSqlFileDirectory";
            this.txtSqlFileDirectory.Size = new System.Drawing.Size(640, 20);
            this.txtSqlFileDirectory.TabIndex = 1;
            // 
            // button1
            // 
            this.button1.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.button1.Location = new System.Drawing.Point(652, 23);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(24, 23);
            this.button1.TabIndex = 2;
            this.button1.Text = "...";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.button1_Click);
            // 
            // lblSqlFileDirectory
            // 
            this.lblSqlFileDirectory.AutoSize = true;
            this.lblSqlFileDirectory.Location = new System.Drawing.Point(9, 7);
            this.lblSqlFileDirectory.Name = "lblSqlFileDirectory";
            this.lblSqlFileDirectory.Size = new System.Drawing.Size(148, 13);
            this.lblSqlFileDirectory.TabIndex = 3;
            this.lblSqlFileDirectory.Text = "Repertoire Racine des Scripts";
            // 
            // ClbListeConnection
            // 
            this.ClbListeConnection.CheckOnClick = true;
            this.ClbListeConnection.FormattingEnabled = true;
            this.ClbListeConnection.Location = new System.Drawing.Point(653, 88);
            this.ClbListeConnection.Name = "ClbListeConnection";
            this.ClbListeConnection.Size = new System.Drawing.Size(275, 184);
            this.ClbListeConnection.TabIndex = 4;
            // 
            // btnCheckAll
            // 
            this.btnCheckAll.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnCheckAll.Location = new System.Drawing.Point(6, 294);
            this.btnCheckAll.Name = "btnCheckAll";
            this.btnCheckAll.Size = new System.Drawing.Size(75, 23);
            this.btnCheckAll.TabIndex = 5;
            this.btnCheckAll.Text = "Tous";
            this.btnCheckAll.UseVisualStyleBackColor = true;
            this.btnCheckAll.Click += new System.EventHandler(this.btnCheckAll_Click);
            // 
            // btnDirectoryParser
            // 
            this.btnDirectoryParser.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnDirectoryParser.Location = new System.Drawing.Point(683, 23);
            this.btnDirectoryParser.Name = "btnDirectoryParser";
            this.btnDirectoryParser.Size = new System.Drawing.Size(115, 23);
            this.btnDirectoryParser.TabIndex = 7;
            this.btnDirectoryParser.Text = "Analyser le repertoire";
            this.btnDirectoryParser.UseVisualStyleBackColor = true;
            this.btnDirectoryParser.Click += new System.EventHandler(this.btnDirectoryParser_Click);
            // 
            // btnCheckNone
            // 
            this.btnCheckNone.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnCheckNone.Location = new System.Drawing.Point(82, 294);
            this.btnCheckNone.Name = "btnCheckNone";
            this.btnCheckNone.Size = new System.Drawing.Size(75, 23);
            this.btnCheckNone.TabIndex = 8;
            this.btnCheckNone.Text = "Aucun";
            this.btnCheckNone.UseVisualStyleBackColor = true;
            this.btnCheckNone.Click += new System.EventHandler(this.btnCheckNone_Click);
            // 
            // btnCheckAll2
            // 
            this.btnCheckAll2.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnCheckAll2.Location = new System.Drawing.Point(657, 290);
            this.btnCheckAll2.Name = "btnCheckAll2";
            this.btnCheckAll2.Size = new System.Drawing.Size(75, 23);
            this.btnCheckAll2.TabIndex = 5;
            this.btnCheckAll2.Text = "Tous";
            this.btnCheckAll2.UseVisualStyleBackColor = true;
            this.btnCheckAll2.Click += new System.EventHandler(this.btnCheckAll2_Click);
            // 
            // btnCheckNone2
            // 
            this.btnCheckNone2.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnCheckNone2.Location = new System.Drawing.Point(733, 290);
            this.btnCheckNone2.Name = "btnCheckNone2";
            this.btnCheckNone2.Size = new System.Drawing.Size(75, 23);
            this.btnCheckNone2.TabIndex = 8;
            this.btnCheckNone2.Text = "Aucun";
            this.btnCheckNone2.UseVisualStyleBackColor = true;
            this.btnCheckNone2.Click += new System.EventHandler(this.btnCheckNone2_Click);
            // 
            // btnExec
            // 
            this.btnExec.BackColor = System.Drawing.Color.Peru;
            this.btnExec.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnExec.ForeColor = System.Drawing.Color.White;
            this.btnExec.Location = new System.Drawing.Point(337, 363);
            this.btnExec.Name = "btnExec";
            this.btnExec.Size = new System.Drawing.Size(219, 23);
            this.btnExec.TabIndex = 9;
            this.btnExec.Text = "Executer Les Scripts";
            this.btnExec.UseVisualStyleBackColor = false;
            this.btnExec.Click += new System.EventHandler(this.btnExec_Click);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(9, 48);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(93, 13);
            this.label1.TabIndex = 3;
            this.label1.Text = "Scripts à Executer";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(654, 48);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(232, 13);
            this.label2.TabIndex = 3;
            this.label2.Text = "Connections sur Lesquelles Executer les Scripts";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(3, 328);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(89, 13);
            this.label3.TabIndex = 3;
            this.label3.Text = "Sortie des Scripts";
            // 
            // btnCheckConnections
            // 
            this.btnCheckConnections.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnCheckConnections.Location = new System.Drawing.Point(809, 290);
            this.btnCheckConnections.Name = "btnCheckConnections";
            this.btnCheckConnections.Size = new System.Drawing.Size(56, 23);
            this.btnCheckConnections.TabIndex = 10;
            this.btnCheckConnections.Text = "Tester !";
            this.btnCheckConnections.UseVisualStyleBackColor = true;
            this.btnCheckConnections.Click += new System.EventHandler(this.btnCheckConnections_Click);
            // 
            // btnShowFiles
            // 
            this.btnShowFiles.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnShowFiles.Location = new System.Drawing.Point(159, 294);
            this.btnShowFiles.Name = "btnShowFiles";
            this.btnShowFiles.Size = new System.Drawing.Size(75, 23);
            this.btnShowFiles.TabIndex = 11;
            this.btnShowFiles.Text = "Afficher";
            this.btnShowFiles.UseVisualStyleBackColor = true;
            this.btnShowFiles.Click += new System.EventHandler(this.btnShowFiles_Click);
            // 
            // cbbFilterConnectionPlateforme
            // 
            this.cbbFilterConnectionPlateforme.FormattingEnabled = true;
            this.cbbFilterConnectionPlateforme.Location = new System.Drawing.Point(653, 64);
            this.cbbFilterConnectionPlateforme.Name = "cbbFilterConnectionPlateforme";
            this.cbbFilterConnectionPlateforme.Size = new System.Drawing.Size(113, 21);
            this.cbbFilterConnectionPlateforme.TabIndex = 12;
            // 
            // btnFilterConnection
            // 
            this.btnFilterConnection.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnFilterConnection.Location = new System.Drawing.Point(853, 62);
            this.btnFilterConnection.Name = "btnFilterConnection";
            this.btnFilterConnection.Size = new System.Drawing.Size(75, 23);
            this.btnFilterConnection.TabIndex = 14;
            this.btnFilterConnection.Text = "Filtrer !";
            this.btnFilterConnection.UseVisualStyleBackColor = true;
            this.btnFilterConnection.Click += new System.EventHandler(this.btnFilterConnection_Click);
            // 
            // cbbFilterConnectionPays
            // 
            this.cbbFilterConnectionPays.FormattingEnabled = true;
            this.cbbFilterConnectionPays.Items.AddRange(new object[] {
            "",
            "[DEV]",
            "[RE7]",
            "[PREPROD]",
            "[PROD]",
            "[BEL]",
            "[CZE]",
            "[DEU]",
            "[ESP]",
            "[FRA]",
            "[GBR]",
            "[ITL]",
            "[PTG]",
            "[FRA]"});
            this.cbbFilterConnectionPays.Location = new System.Drawing.Point(772, 64);
            this.cbbFilterConnectionPays.Name = "cbbFilterConnectionPays";
            this.cbbFilterConnectionPays.Size = new System.Drawing.Size(75, 21);
            this.cbbFilterConnectionPays.TabIndex = 12;
            // 
            // txtFileFilter
            // 
            this.txtFileFilter.Location = new System.Drawing.Point(6, 64);
            this.txtFileFilter.Name = "txtFileFilter";
            this.txtFileFilter.Size = new System.Drawing.Size(100, 20);
            this.txtFileFilter.TabIndex = 15;
            // 
            // btnFileFilter
            // 
            this.btnFileFilter.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnFileFilter.Location = new System.Drawing.Point(110, 63);
            this.btnFileFilter.Name = "btnFileFilter";
            this.btnFileFilter.Size = new System.Drawing.Size(75, 21);
            this.btnFileFilter.TabIndex = 16;
            this.btnFileFilter.Text = "Filtrer";
            this.btnFileFilter.UseVisualStyleBackColor = true;
            this.btnFileFilter.Click += new System.EventHandler(this.btnFileFilter_Click);
            // 
            // txtSortie
            // 
            this.txtSortie.Dock = System.Windows.Forms.DockStyle.Bottom;
            this.txtSortie.Location = new System.Drawing.Point(0, 399);
            this.txtSortie.Margin = new System.Windows.Forms.Padding(10);
            this.txtSortie.Name = "txtSortie";
            this.txtSortie.Size = new System.Drawing.Size(940, 314);
            this.txtSortie.TabIndex = 17;
            this.txtSortie.Text = "";
            // 
            // txtVersion
            // 
            this.txtVersion.Location = new System.Drawing.Point(427, 337);
            this.txtVersion.Name = "txtVersion";
            this.txtVersion.Size = new System.Drawing.Size(129, 20);
            this.txtVersion.TabIndex = 18;
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(334, 340);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(87, 13);
            this.label4.TabIndex = 19;
            this.label4.Text = "Version attendue";
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(940, 713);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.txtVersion);
            this.Controls.Add(this.txtSortie);
            this.Controls.Add(this.btnFileFilter);
            this.Controls.Add(this.txtFileFilter);
            this.Controls.Add(this.btnFilterConnection);
            this.Controls.Add(this.cbbFilterConnectionPays);
            this.Controls.Add(this.cbbFilterConnectionPlateforme);
            this.Controls.Add(this.btnShowFiles);
            this.Controls.Add(this.btnCheckConnections);
            this.Controls.Add(this.btnExec);
            this.Controls.Add(this.btnCheckNone2);
            this.Controls.Add(this.btnCheckNone);
            this.Controls.Add(this.btnDirectoryParser);
            this.Controls.Add(this.btnCheckAll2);
            this.Controls.Add(this.btnCheckAll);
            this.Controls.Add(this.ClbListeConnection);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.lblSqlFileDirectory);
            this.Controls.Add(this.button1);
            this.Controls.Add(this.txtSqlFileDirectory);
            this.Controls.Add(this.ClbListeFichiers);
            this.Name = "Form1";
            this.Text = "Execution de SCRIPTS SQL";
            this.Load += new System.EventHandler(this.Form1_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.CheckedListBox ClbListeFichiers;
        private System.Windows.Forms.TextBox txtSqlFileDirectory;
        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.Label lblSqlFileDirectory;
        private System.Windows.Forms.CheckedListBox ClbListeConnection;
        private System.Windows.Forms.Button btnCheckAll;
        private System.Windows.Forms.Button btnDirectoryParser;
        private System.Windows.Forms.Button btnCheckNone;
        private System.Windows.Forms.Button btnCheckAll2;
        private System.Windows.Forms.Button btnCheckNone2;
        private System.Windows.Forms.Button btnExec;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Button btnCheckConnections;
        private System.Windows.Forms.Button btnShowFiles;
        private System.Windows.Forms.ComboBox cbbFilterConnectionPlateforme;
        private System.Windows.Forms.Button btnFilterConnection;
        private System.Windows.Forms.ComboBox cbbFilterConnectionPays;
        private System.Windows.Forms.TextBox txtFileFilter;
        private System.Windows.Forms.Button btnFileFilter;
        private System.Windows.Forms.TextBox txtSortie;
        private System.Windows.Forms.TextBox txtVersion;
        private System.Windows.Forms.Label label4;
    }
}

